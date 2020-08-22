import { ComplexityComponent } from './complexity.component';

describe('ComplexityComponent', () => {

  let component: ComplexityComponent;
  let contentLinePerWord: any [];
  let contenFilePerLine: string[];
  let initPosition: number;
  let endPosition: number;
  let contentFile: string;

  beforeAll(() => {
    component = new ComplexityComponent();
    component.contentFilePerLine = contenFilePerLine;
    component.contentLinePerWord = contentLinePerWord;
  });

  beforeEach(() => {
    component = new ComplexityComponent();

    component.links = [];
    component.nodes = [];
    component.pairInstruction = [];
    component.parentsInstructions = [];
    component.contentFilePerLine = [];
    component.contentLinePerWord = [];

    component.complexity = 0;
    component.javaInstructions = ['if', 'for', 'while', 'public', 'class', 'protected', 'private'];

    contentFile =
    `class PalindromeTest {
      public static void main(String[] args) {
          System.out.println("Este es un bucle for");
          int a = 1;
          for (int i = 0; i < 5; ++i) {
              a = a + i;
              System.out.println(i);
              System.out.println("Estamos presentando el resultado de A en cada iteración");
              if(a == 5){
                  System.out.println("A tiene el valor de 5");
              }
          }
          System.out.println("Fin del Bucle for");
        }
    }`;

    contentLinePerWord = [
      ['class', 'PalindromeTest', '{'],
      ['public', 'static', 'void', 'main(String[]', 'args)', '{'],
      ['System.out.println("Este', 'es', 'un', 'bucle', 'for");'],
      ['int', 'a', '=', '1;'],
      ['for', '(int', 'i', '=', '0;', 'i', '<', '5;', '++i)', '{'],
      ['a', '=', 'a', '+', 'i;'],
      ['System.out.println(i);'],
      ['System.out.println("Estamos', 'presentando', 'el', 'resultado', 'de', 'A', 'en', 'cada', 'iteración");'],
      ['if(a', '==', '5){'],
      ['System.out.println("A', 'tiene', 'el', 'valor', 'de', '5");'],
      ['}'],
      ['}'],
      ['System.out.println("Fin', 'del', 'Bucle', 'for");'],
      ['}'],
      ['}']
    ];

    contenFilePerLine = [
      'class PalindromeTest {',
      'public static void main(String[] args) {',
      'System.out.println("Este es un bucle for");',
      'int a = 1;',
      'for (int i = 0; i < 5; ++i) {',
      'a = a + i;',
      'System.out.println(i);',
      'System.out.println("Estamos presentando el resultado de A en cada iteración");',
      'if(a == 5){',
      'System.out.println("A tiene el valor de 5");',
      '}',
      '}',
      'System.out.println("Fin del Bucle for");',
      '}',
      '}',
    ];

    initPosition = 0;
    endPosition = 15;
  });

  it('#readFileLineByLine Lee el archivo línea por línea', () => {

    component.readFileLineByLine(contentFile);

    const verifyContentFilePerLine: any[] = component.contentFilePerLine;

    /* Verificamos si el tamaño del arreglo que devuelve el método es igual a nuestra variable declarada*/
    expect(verifyContentFilePerLine.length).toEqual(contenFilePerLine.length);

    /* Verificamos si el contenido de lo que devuelve el método es igual con nuestra variable declarada */
    expect(verifyContentFilePerLine).toEqual(contenFilePerLine);
  });

  it('#getContentLinePerWord Lee cada línea y la devuelve dividida por espacios ', () => {

    const verifyContenLinePerWord: any[] = component.getContentLinePerWord(contenFilePerLine);

    /* Verificamos si el tamaño del arreglo que devuelve el método es igual a nuestra variable declarada */
    expect(verifyContenLinePerWord.length).toBe(contentLinePerWord.length);

    /* Verificamos si el contenido de lo que devuelve el método es igual con nuestra variable declarada */
    expect(verifyContenLinePerWord).toEqual(contentLinePerWord);

  });

  it('#getPairInstructions Lee cada línea y la devuelve dividida por espacios ', () => {

    const expectedResult = [
      ['class', 0, 14],
      ['public', 1, 13],
      ['for', 4, 11],
      ['if', 8, 10],
    ];

    const verifyPairInstruction: any[] = component.getPairInstructions(contenFilePerLine, contentLinePerWord);
    /* Verificamos si el tamaño del arreglo que devuelve el método es igual a nuestra variable declarada */
    expect(verifyPairInstruction.length).toBe(expectedResult.length);

    /* Verificamos si el contenido de lo que devuelve el método es igual con nuestra variable declarada */
    expect(verifyPairInstruction.length).toBe(expectedResult.length);
  });

  it('#getParentsInstructions verifica las instrucciones Padres', () => {

    const parents = [
      {
        parent: ['class', 0, 14],
        childrens: [
          ['public', 1, 13]
        ]
      },
      {
        parent: ['public', 1, 13],
        childrens: [
          ['for', 4, 11]
        ]
      },
      {
        parent: ['for', 4, 11],
        childrens: [
          ['if', 8, 10]
        ]
      },
    ];

    const verifyPairInstruction: any[] = component.getPairInstructions(contenFilePerLine, contentLinePerWord);

    const verifyParentsInstructions: any [] = component.getParentsInstructions(verifyPairInstruction);

    expect(verifyParentsInstructions.length).toBe(parents.length);

    expect(verifyParentsInstructions).toEqual(parents);

  });

  it('#getSpecificInstructionByWord If instruction - obtener la instrucción específica', () => {
    const testIntruction = 'if(a>b){';
    const instruction = 'if';

    const verifyInstructions = component.getSpecificInstructionByWord(testIntruction);

    expect(verifyInstructions).toBe(instruction);
  });

  it('#getSpecificInstructionByWord for instruction - obtener la instrucción específica', () => {
    const testIntruction = 'for(int a=0){';
    const instruction = 'for';

    const verifyInstructions = component.getSpecificInstructionByWord(testIntruction);

    expect(verifyInstructions).toBe(instruction);
  });

  it('#getSpecificInstructionByWord while instruction - obtener la instrucción específica', () => {
    const testIntruction = 'while(a){';
    const instruction = 'while';

    const verifyInstructions = component.getSpecificInstructionByWord(testIntruction);

    expect(verifyInstructions).toBe(instruction);
  });

  it('#verifyOnlyOneInstruction Verifica que solo exista una instrucción - False', () => {

    const expectedResult = [
      ['class', 0, 14],
      ['public', 1, 13],
      ['for', 4, 11],
      ['if', 8, 10],
    ];

    const isOnlyOneInstruction = component.verifyOnlyOneInstruction(expectedResult);

    expect(isOnlyOneInstruction).toBe(false);
  });

  it('#verifyOnlyOneInstruction Verifica que solo exista una instrucción - True', () => {

    const expectedResult = [
      ['class', 0, 14],
    ];

    const isOnlyOneInstruction = component.verifyOnlyOneInstruction(expectedResult);

    expect(isOnlyOneInstruction).toBe(true);
  });

  it('#drawInitialAndEndNodesWithLink dibuja el nodo inicial y final - For Instruction', () => {

    const instruction = ['for', 0, 14];

    component.drawInitialAndEndNodesWithLink(instruction);

    /* Verifico que se ha creado el nodo de inicio y el nodo de fin correctamente */
    expect(component.nodes.length).toBe(2);

    expect(component.links.length).toBe(1);

    expect(component.nodes[0].id).toBe(`N${instruction[1]}`);

    expect(component.nodes[1].id).toBe(`N${instruction[2]}`);
  });

  it('#drawInitialAndEndNodesWithLink dibuja el nodo inicial y final - While Instruction', () => {

    const instruction = ['while', 0, 14];

    component.drawInitialAndEndNodesWithLink(instruction);

    /* Verifico que se ha creado el nodo de inicio y el nodo de fin correctamente */
    expect(component.nodes.length).toBe(2);

    expect(component.links.length).toBe(1);

    expect(component.nodes[0].id).toBe(`N${instruction[1]}`);

    expect(component.nodes[1].id).toBe(`N${instruction[2]}`);
  });

  it('#drawInitialAndEndNodesWithLink dibuja el nodo inicial y final - Class Instruction', () => {

    const instruction = ['class', 0, 14];

    component.drawInitialAndEndNodesWithLink(instruction);

    /* Verifico que se ha creado el nodo de inicio y el nodo de fin correctamente */
    expect(component.nodes.length).toBe(2);

    expect(component.links.length).toBe(0);

    expect(component.nodes[0].id).toBe(`N${instruction[1]}`);

    expect(component.nodes[1].id).toBe(`N${instruction[2]}`);
  });

  it('#drawInitialAndEndNodesWithLink dibuja el nodo inicial y final - Public Instruction', () => {

    const instruction = ['public', 0, 14];

    component.drawInitialAndEndNodesWithLink(instruction);

    /* Verifico que se ha creado el nodo de inicio y el nodo de fin correctamente */
    expect(component.nodes.length).toBe(2);

    expect(component.links.length).toBe(0);

    expect(component.nodes[0].id).toBe(`N${instruction[1]}`);

    expect(component.nodes[1].id).toBe(`N${instruction[2]}`);
  });

  it('#drawInitialAndEndNodesWithLink dibuja el nodo inicial y final - If Instruction', () => {

    const instruction = ['if', 8, 10];

    component.contentFilePerLine = [...contenFilePerLine];

    component.drawInitialAndEndNodesWithLink(instruction);

    /* Verifico que se ha creado el nodo de inicio y el nodo de fin correctamente */
    expect(component.nodes.length).toBe(2);

    expect(component.links.length).toBe(1);

    expect(component.nodes[0].id).toBe(`N${instruction[1]}`);

    expect(component.nodes[1].id).toBe(`N${instruction[2]}`);
  });

  it('#calculateComplexity ejecuta el método principal para obtener la complejidad ciclómatica de un archivo', () => {

    const complexityFile = 3;

    component.contentFilePerLine = [...contenFilePerLine];

    const currentComplexity = component.calculateComplexity(contenFilePerLine);

    component.contentLinePerWord = contentLinePerWord;

    expect(component.contentLinePerWord).toEqual(contentLinePerWord);

    expect(currentComplexity).toBe(complexityFile);
  });

  it('#getArrayOfNotInstructions Obtiene un arreglo de las no instrucciones - 3 No instrucciones' , () => {

    const parent = {
      parent: ['public', 1, 13],
      childrens: [
        ['for', 4, 11]
      ]
    };

    const expectedResult = [2, 3, 12];

    const verifyNotInstructions = component.getArrayOfNotInstructions(parent);

    expect(verifyNotInstructions.length).toBe(3);

    expect(verifyNotInstructions).toEqual(expectedResult);

  });

  it('#getArrayOfNotInstructions Obtiene un arreglo de las no instrucciones - 0 No instrucciones' , () => {

    const parent = {
      parent: ['public', 1, 13],
      childrens: [
        ['for', 2, 12]
      ]
    };

    const expectedResult = [];

    const verifyNotInstructions = component.getArrayOfNotInstructions(parent);

    expect(verifyNotInstructions.length).toBe(0);

    expect(verifyNotInstructions).toEqual(expectedResult);

  });

  it('#drawChildrenWithLink Dibuja a los instrucciones hijas de un padre', () => {

    const parent = {
      parent: ['public', 1, 13],
      childrens: [
        ['for', 2, 12]
      ]
    };

    component.drawInitialAndEndNodesWithLink(parent.parent);

    component.contentFilePerLine = [...contenFilePerLine];

    component.drawChildrenWithLink(parent);

    expect(component.nodes.length).toBe(13);

    expect(component.links.length).toBe(13);

  });

  // tslint:disable-next-line: max-line-length
  it('#getArrayOfNotInstructionsInsideChildren Obtiene un arreglo de no instrucciones dentro de una instrucción Hija - Varias NO Instrucciones', () => {

    const instruction = ['if', 4, 15];

    const array = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    const verifyArray = component.getArrayOfNotInstructionsInsideChildren(instruction);

    expect(verifyArray.length).toBe(array.length);

    expect(verifyArray).toEqual(array);
  });

  // tslint:disable-next-line: max-line-length
  it('#getArrayOfNotInstructionsInsideChildren Obtiene un arreglo de no instrucciones dentro de una instrucción Hija - Una NO Instrucciones', () => {

    const instruction = ['if', 4, 6];

    const array = [5];

    const verifyArray = component.getArrayOfNotInstructionsInsideChildren(instruction);

    expect(verifyArray.length).toBe(array.length);

    expect(verifyArray).toEqual(array);
  });

  it('#verifyIfInstructionHasElse verifica si una instrcción if consta de else', () => {

    const instruction = ['if', 8, 10];

    component.contentFilePerLine = [...contenFilePerLine];

    const verifyLine = component.verifyIfInstructionHasElse(instruction);

    expect(verifyLine).toBeNull();

  });

  it('#getLastChildrenEndOfParent Obtiene el último instrucción hija de una  instrucción padre', () => {

    const parent = {
      parent: ['public', 1, 13],
      childrens: [
        ['for', 2, 9],
        ['if', 10, 12]
      ]
    };

    const verifyChildren: number = component.getLastChildrenEndOfParent(parent);

    expect(verifyChildren).toBe(12);
  });

  it('#createLinkIfParentIsLoopInstruction Creación de link si el padre es un Loop - SI ES LOOP', () => {

    const parent = ['for', 1, 13];
    const notInstruction = 12;

    component.createLinkIfParentIsLoopInstruction(parent, notInstruction);

    expect(component.links[0].source).toBe(`N${notInstruction}`);
    expect(component.links[0].target).toBe(`N${parent[1]}`);
  });

  it('#createLinkIfParentIsLoopInstruction Creación de link si el padre es un Loop - NO ES LOOP', () => {

    const parent = ['if', 1, 13];
    const notInstruction = 12;

    component.createLinkIfParentIsLoopInstruction(parent, notInstruction);

    expect(component.links[0].source).toBe(`N${notInstruction}`);
    expect(component.links[0].target).toBe(`N${parent[2]}`);
  });

  it('#drawBrothers Dibujar enlaces entre hermanos - Instrucciones hermanas for - if', () => {

    const parent = {
      parent: ['public', 1, 13],
      childrens: [
        ['for', 2, 9],
        ['if', 10, 12]
      ]
    };

    component.drawBrothers(parent);

    expect(component.links.length).toBe(1);
    expect(component.links[0].source).toBe(`N${parent.childrens[0][2]}`);
    expect(component.links[0].target).toBe(`N${parent.childrens[1][1]}`);
  });

  it('#drawBrothers Dibujar enlaces entre hermanos - Instrucciones hermanas - PUBLIC', () => {

    const parent = {
      parent: ['class', 1, 13],
      childrens: [
        ['public', 2, 9],
        ['public', 10, 12]
      ]
    };

    component.drawBrothers(parent);

    expect(component.links.length).toBe(0);
  });


});
