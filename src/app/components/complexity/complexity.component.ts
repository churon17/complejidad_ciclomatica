import { Component, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { HighlightResult } from 'ngx-highlightjs';
import { element } from 'protractor';

@Component({
  selector: 'app-complexity',
  templateUrl: './complexity.component.html',
  styles: []
})

export class ComplexityComponent{

  links: any[] = [
    // {
    //   id: 'a',
    //   source: 'first',
    //   target: 'second',
    //   label: 'is parent of'
    // },
    // {
    //   id: 'b',
    //   source: 'first',
    //   target: 'c1',
    //   label: 'custom label'
    // },
    // {
    //   id: 'd',
    //   source: 'first',
    //   target: 'c2',
    //   label: 'custom label'
    // },
    // {
    //   id: 'f',
    //   source: 'd',
    //   target: 'e',
    //   label: 'custom label'
    // },
  ];

  nodes: any[] = [
    // {
    //   id: 'first',
    //   label: 'A'
    // },
    // {
    //   id: 'second',
    //   label: 'B'
    // },
    // {
    //   id: 'c1',
    //   label: 'C1'
    // },
    // {
    //   id: 'c2',
    //   label: 'C2'
    // },
    // {
    //   id: 'd',
    //   label: 'D'
    // },
    // {
    //   id: 'e',
    //   label: 'E'
    // }
  ];

  fileName: string = 'Elegir Archivo';

  currentFileType: string = 'Aún no seleccionado';

  response: HighlightResult;

  uploadFile: File;

  code: string = `print('Hola mundo')`;

  constructor(private cd: ChangeDetectorRef){}

  async selectScript(file: File){

    if (!file){
      this.uploadFile = file;
      return;
    }

    this.verifyFileType(file);

    this.uploadFile = file;

    this.fileName = this.uploadFile.name;

    this.code = await this.readFile();

    this.readFileLineByLine(this.code);
  }


  verifyFileType(file: File){

    if (file.type.indexOf('javascript') < 0){
      if (file.type.indexOf('java') < 0){
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
        this.currentFileType = 'Java';
      }
    }else{
      this.currentFileType = 'JavaScript';
    }
  }

  readFile(): Promise<string>{

    return new Promise((res, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const content = fileReader.result;
        res(content.toString());
      };
      fileReader.readAsText(this.uploadFile);
    });
  }

  readFileLineByLine(contentFile: string){

    const contentFilePerLine: string[] = contentFile.split('\n').map(line => line.trim()).filter(line => line !== '');

    const complexity = this.currentFileType === 'Java' ? this.calculateComplexityJava(contentFilePerLine)
    : this.currentFileType === 'PHP' ? this.calculateComplexityPhp(contentFilePerLine)
    : this.calculateComplexityJS(contentFilePerLine);


  }


  calculateComplexityJava(contentFilePerLine: string[]): number{

    const contentLinePerWord = this.getContentLinePerWord(contentFilePerLine);

    this.executeJava(contentLinePerWord, contentFilePerLine, 0, contentFilePerLine.length);

    return 0;
  }

  // TODO: Change method name
  executeJava(contentLinePerWord: string[][], contentFilePerLine: string[], initPosition: number, endPosition: number) {

    console.log(contentFilePerLine, 'Per Line');
    console.log(contentLinePerWord, 'Per word');

    for (let init = initPosition; init < endPosition; init++){

      const instruction = contentLinePerWord[init][0];

      if (instruction.includes('if(') || instruction.includes('if (')){

        initPosition = init;

        this.createNodeForGraph(init.toString());

        endPosition = this.getEndPosition(initPosition, contentFilePerLine);

        console.log(initPosition, 'Init');

        console.log(endPosition, 'End');

      }
    }
  }

  getEndPosition(initPosition: number, contentFilePerLine: string[] ){

    for (let init = initPosition; init < contentFilePerLine.length ; init++){

      const line = contentFilePerLine[init];

      if (line.includes('}')){
        return init;
      }
    }
  }

  calculateComplexityPhp(contentFilePerLine: string[]){

    const contentLine = this.getContentLinePerWord(contentFilePerLine);
    return 0;
  }

  calculateComplexityJS(contentFilePerLine: string[]){

    const contentLine = this.getContentLinePerWord(contentFilePerLine);
    return 0;
  }


  getContentLinePerWord(contentFilePerLine: string[]): string[][]{

    const contentLine: string[][] = [];

    contentFilePerLine.forEach((line: string) => {

        const wordsInLine = line.split(' ');
        contentLine.push(wordsInLine);
    });

    return contentLine;
  }


  createLinkForGraph(id: string, source: string, target: string){

    const link: any = {
      id,
      source,
      target,
      label : 'Custom Label'
    };

    this.links.push(link);
  }

  createNodeForGraph(id: string){

    const label = id.toUpperCase();

    const node: any = {
      id,
      label
    };

    this.nodes.push(node);
  }
}
