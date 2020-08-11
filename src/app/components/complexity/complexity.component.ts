import { Component, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';

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

    let parents = [];

    for (const firstValue of checkParents) {

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

    /* Filtro el arreglo de padres, eliminando los padres que no tienen hijos */
    parents = parents.filter(parent =>  parent.childrens.length !== 0);

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

    console.log('Padre', this.parentsInstructions);

    parent.childrens.forEach((children, index)  => {

      if (!this.existNodeInGraph(`N${children[1]}`)) {
        const idLink = 'l' + children[1].toString() + children[2].toString();

        /* ESTE IF - Tomamos en cuenta el primer hijo del padre, para crear los nodos y links de las noInstrucciones
        entre ellos */
        if (index === 0){
          const notInstructions = this.getArrayOfNotInstructions(parent.parent[1], children[1]);
          this.createNodesAndLinksForNotInstructions(parent.parent, children, notInstructions);
        }

        /* Creamos el nodo  para la instrucción hija con su respectivo nodo de terminación y el enlace entre ellos*/
        this.createNodeForGraph(`N${children[1]}`);
        this.createNodeForGraph(`N${children[2]}`);
        this.createLinkForGraph(idLink, `N${children[1]}`, `N${children[2]}`);
      }

      /*  Verificamos todas las instrucciones que no son padres
      Tomando en cuenta que una instrucción que es hijo, también puede ser padre
      */
      const isParent = this.drawInstructionInsideNoParent(children);

      if (!isParent){

        console.log('Pilas con estos', children[1], children[2]);

        const notInstructions = this.getArrayOfNotInstructions(children[1], children[2]);

        console.log('nO INSTRUCCIONES', notInstructions);


        this.createNodesAndLinksForNotInstructions([1, children[1]], [1, children[2]], notInstructions);
      }

    });
  }


  getArrayOfNotInstructions(initial: number, end: number): number[]{
    const notInstructions: number[] = [];

    for (let init = initial + 1; init < end; init++) {
      notInstructions.push(init);
    }

    return notInstructions;
  }

  /*  Crea los nodos y los links entre el primer hijo y el padre*/
  createNodesAndLinksForNotInstructions(parent: any, children: any, notInstructions: any[]){

    /* Verificamos que entre la instrucción Padre y la primera instrucción hija exista más de una no instrucción */
    if (notInstructions.length > 1){
      for (let init = 0; init < notInstructions.length; init++) {

        /* Creamos el nodo para la no instrucción */
        this.createNodeForGraph(`N${notInstructions[init]}`);

        /* Si es que es la primera instrucción hacemos el enlace con el padre */
        if (init === 0){
          this.createLinkForGraph('L', `N${parent[1]}`, `N${notInstructions[init]}`);
        }

        /* Si es que es la ultima instrucción hacemos el enlace con el hijo */
        if (init === notInstructions.length - 1){
          this.createLinkForGraph('L', `N${notInstructions[init]}`, `N${children[1]}`);
        }

        /* En caso que exista más de dos noInstrucciones*/
        if (notInstructions.length > 2){

          this.createLinkForGraph('L', `N${notInstructions[init] - 1}`, `N${notInstructions[init]}`);
          this.createLinkForGraph('L', `N${notInstructions[init]}`, `N${notInstructions[init] + 1}`);

        }else{
          this.createLinkForGraph('L', `N${notInstructions[init]}`, `N${notInstructions[init] + 1}`);
        }

      }
    }else if (notInstructions.length === 1){
      /* En caso de que exista una sola instrucción entre la instrucción padre e hija */
      const linkWithFather = 'l' + parent[1].toString() + children[1].toString();
      this.createNodeForGraph(`N${notInstructions[0]}`);
      this.createLinkForGraph(linkWithFather, `N${parent[1]}`, `N${notInstructions[0]}` );
      this.createLinkForGraph(linkWithFather, `N${notInstructions[0]}`, `N${children[1]}` );
    }
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
