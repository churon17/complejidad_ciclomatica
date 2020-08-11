import { Component, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { element } from 'protractor';


@Component({
  selector: 'app-complexity',
  templateUrl: './complexity.component.html',
  styles: []
})

export class ComplexityComponent{

  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

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
      id: 'f',
      source: 'd',
      target: 'e',
      label: 'custom label'
    },
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
    },
    {
      id: 'e',
      label: 'E'
    }
  ];

  fileName: string = 'Elegir Archivo';

  currentFileType: string = 'Aún no seleccionado';

  pairInstruction = [];

  parentsInstructions = [];

  uploadFile: File;

  code: string = `print('Hola mundo')`;

  javaInstructions = ['if', 'for'];

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

    console.log(contentLinePerWord);

    this.executeJava(contentLinePerWord, contentFilePerLine, 0, contentFilePerLine.length);

    this.parentsInstructions = this.getParentsInstructions(this.pairInstruction);

    this.drawAllNodesAndLinksWithFathers();

    return 0;
  }

  // TODO: Change method name
  executeJava(contentLinePerWord: string[][], contentFilePerLine: string[], initPosition: number, endPosition: number) {

    const currentPositionsInstruction = [];
    const currentInstructions = [];

    for (let init = initPosition; init < endPosition; init++){

      const line = contentFilePerLine[init];

      const firstWordInLine = contentLinePerWord[init][0];

      const instructionByWord = this.getSpecificInstructionByWord(firstWordInLine);

      const indexInstruction = this.javaInstructions.indexOf(instructionByWord);

      if (indexInstruction > -1){

        currentPositionsInstruction.push(init);
        currentInstructions.push(instructionByWord);

      }

      if (line.includes('}')){

        const currentInstruction = currentInstructions.pop();
        const currentPositionInstruction: number =  currentPositionsInstruction.pop();
        this.pairInstruction.push([currentInstruction, currentPositionInstruction, init]);

      }
    }

    this.pairInstruction = this.pairInstruction.filter(array => array.includes(undefined) === false);

  }

  getParentsInstructions(checkParents: any[]){

    checkParents = checkParents.sort((a, b) => a[1] - b[1]);

    const parents = [];

    for (const firstValue of checkParents) {

      if ((firstValue[1] + 1) !== (firstValue[2] - 1)){

        const childrens: any = [];

        for (const secondValue of checkParents) {

          if (secondValue[1] > firstValue[1] && secondValue[2] < firstValue[2]){

            if (childrens.length > 0) {
              let isSon = true;
              for (const children of childrens) {
                if (secondValue[1] > children[1] && secondValue[2] < children[2]){
                  isSon = false;
                }
              }

              if (isSon){
                childrens.push(secondValue);
              }

            }else{
              childrens.push(secondValue);
            }
          }
        }

        const parent = {
          parent: firstValue,
          childrens
        };

        parents.push(parent);
      }
    }

    console.log(parents, 'PADRES');

    return parents;
  }

  drawAllNodesAndLinksWithFathers(){

    this.parentsInstructions = this.parentsInstructions.sort((a, b) => a.parent[1] - b.parent[1]);

    this.parentsInstructions.forEach(parent => {

      if (!this.existNodeInGraph(`N${parent.parent[1]}`)) {

        this.drawParentWithLink(parent);

        if (parent.childrens.length > 0){

          this.drawChildrenWithLink(parent);

          if (parent.childrens.length > 1){
            this.drawBrothers(parent);
          }
        }
      }else{
        if (parent.childrens.length > 0){

          this.drawChildrenWithLink(parent);

          if (parent.childrens.length > 1){
            this.drawBrothers(parent);
          }
        }
      }
    });
  }

  drawParentWithLink(parent: any){
    const idLink = 'l' + parent.parent[1].toString() + parent.parent[2].toString();
    this.createNodeForGraph(`N${parent.parent[1]}`);
    this.createNodeForGraph(`N${parent.parent[2]}`);
    this.createLinkForGraph(idLink, `N${parent.parent[1]}`, `N${parent.parent[2]}`);
  }

  drawInstructionInsideNoParent(children: any){

    let isParent = false;

    this.parentsInstructions.forEach(parent => {

      if (parent.parent === children){
        isParent = true;
      }
    });

    return isParent;
  }


  drawChildrenWithLink(parent: any){
    console.log('Arreglo parents.childres', parent.parent );
    console.log(this.parentsInstructions);
    parent.childrens.forEach((children, index)  => {

      if (!this.existNodeInGraph(`N${children[1]}`)) {
        const idLink = 'l' + children[1].toString() + children[2].toString();
        const linkWithFather = 'l' + parent.parent[1].toString() + children[1].toString();

        if (index === 0){
          let areInstructionsInside = false;
          for (let init = parent.parent[1] + 1; init < children[1]; init++) {
            this.createNodeForGraph(`N${init}`);
            this.createLinkForGraph('L', `N${parent.parent[1]}`, `N${init}` );
            this.createLinkForGraph('L', `N${init}`, `N${children[1]}` );
            areInstructionsInside = true;
          }
          if (!areInstructionsInside){
            this.createLinkForGraph(linkWithFather, `N${parent.parent[1]}`, `N${children[1]}` );
          }
        }

        this.createNodeForGraph(`N${children[1]}`);
        this.createNodeForGraph(`N${children[2]}`);
        this.createLinkForGraph(idLink, `N${children[1]}`, `N${children[2]}`);
      }

      const isParent = this.drawInstructionInsideNoParent(children);

      if (!isParent){
        this.createNodeForGraph(`N${children[1] + 1}`);
        this.createLinkForGraph('L', `N${children[1]}`, `N${children[1] + 1}` );
        this.createLinkForGraph('L', `N${children[1] + 1}`, `N${children[2]}` );
      }

    });
  }

  drawBrothers(parent: any){
      /* Ordenar Hermanos */
      const checkBrothers: any[] = parent.childrens.sort((a, b) => a[1] - b[1]);

      for (let init = 0; init < checkBrothers.length; init++) {

        if (init + 1 !== checkBrothers.length){
          const source = checkBrothers[init][2];
          const target = checkBrothers[init + 1][1];
          const linkWithBrother = 'l' + checkBrothers[init][2].toString() + checkBrothers[init + 1][1].toString();
          this.createLinkForGraph(linkWithBrother, `N${source}`, `N${target}` );
        }
    }
  }

  existNodeInGraph(idNode: string){
    for (const node of this.nodes) {
      if (node.id === idNode){
        return true;
      }
    }
    return false;
  }


  getSpecificInstructionByWord(instruction: string): string{

    for (const currentInstruction of this.javaInstructions) {

      if (instruction.includes(currentInstruction)){

        const newInstruction: string[] = instruction.split(currentInstruction)
                                                  .map(emptyInstruction =>  emptyInstruction.replace('', currentInstruction));

        return newInstruction[0];
      }
    }
    return instruction;
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


  /* Methods for Graph */

  createNodeForGraph(id: string){

    const label = id.toUpperCase();

    const node: any = {
      id,
      label
    };

    this.nodes.push(node);
    this.nodes = [...this.nodes];
  }

  createLinkForGraph(id: string, source: string, target: string){

    const link: any = {
      id,
      source,
      target,
      label : 'Custom Label'
    };

    this.links.push(link);
    this.links = [...this.links];
  }


  updateGraph() {
    this.update$.next(true);
  }

  centerGraph() {
    this.center$.next(true);
  }

  fitGraph() {
    this.zoomToFit$.next(true);
  }

}
