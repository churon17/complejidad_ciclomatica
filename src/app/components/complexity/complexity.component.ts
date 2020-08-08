import { Component, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { HighlightResult } from 'ngx-highlightjs';

@Component({
  selector: 'app-complexity',
  templateUrl: './complexity.component.html',
  styles: []
})

export class ComplexityComponent{

  links: any[] = [
    {
      id: 'a',
      source: 'first',
      target: 'second',
      label: 'is parent of'
    },
    {
      id: 'b',
      source: 'first',
      target: 'c1',
      label: 'custom label'
    },
    {
      id: 'd',
      source: 'first',
      target: 'c2',
      label: 'custom label'
    },
    {
      id: 'e',
      source: 'c1',
      target: 'd',
      label: 'first link'
    },
    {
      id: 'f',
      source: 'c1',
      target: 'd',
      label: 'second link'
    }
  ];

  nodes: any[] = [
    {
      id: 'first',
      label: 'A'
    },
    {
      id: 'second',
      label: 'B'
    },
    {
      id: 'c1',
      label: 'C1'
    },
    {
      id: 'c2',
      label: 'C2'
    },
    {
      id: 'd',
      label: 'D'
    }
  ];

  fileName: string = 'Elegir Archivo';

  currentFileType: string = 'Aún no seleccionado';

  response: HighlightResult;

  uploadFile: File;

  code: string = `print('Hola mundo')` ;

  constructor(private cd: ChangeDetectorRef){}


  async selectScript(file: File){
    if (!file){
      this.uploadFile = file;
      return;
    }

    this.verifyFileType(file);

    this.uploadFile = file;

    this.fileName = this.uploadFile.name;

    this.code = await this.readFile(this.uploadFile);

    this.readFileLineByLine(this.code);
  }


  verifyFileType(file: File){

    if (file.type.indexOf('javascript') < 0){
      if (file.type.indexOf('python') < 0){
        if (file.type.indexOf('php') < 0){
          Swal.fire(
            {
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor selecciona un archivo válido',
            }
          );
          this.uploadFile = null;
          return;
        }else{
          this.currentFileType = 'PHP';
        }
      }else{
        this.currentFileType = 'Python';
      }
    }else{
      this.currentFileType = 'JavaScript';
    }
  }

  readFile(file: File): Promise<string>{

    return new Promise((res, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const content = fileReader.result;
        res(content.toString());
      };
      fileReader.readAsText(this.uploadFile);
    });
  }

  readFileLineByLine(file : string){

    console.log(file.split('\n'));

  }
}
