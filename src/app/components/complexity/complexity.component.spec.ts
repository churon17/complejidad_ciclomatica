import { ComplexityComponent } from './complexity.component';

describe('ComplexityComponent', () => {

  let component: ComplexityComponent;
  let contentLinePerWord: any [];
  let contenFilePerLine: any[];
  let initPosition: number;
  let endPosition: number;

  beforeEach(() => {
    component = new ComplexityComponent();
    component.parentsInstructions = [];
    component.pairInstruction = [];

    contentLinePerWord = [
      [ 'import', 'java.util.Stack;' ],
      [ 'import', 'java.util.Scanner;' ],
      [ 'class', 'PalindromeTest', '{' ],
      ['public', 'static', 'void', 'main(String[]', 'args)', '{'],
      ['if(a>2){'],
      ['if(a>2){'],
      ['System.out.println("Es", "mayor", "que", "2");'],
      ['}'],
      ['System.out.println("Es", "mayor", "que", "2");'],
      ['}'],
      ['System.out.println("Es", "mayor", "que", "2");'],
      ['}'],
      ['}'],
      ['}'],
    ];

    contenFilePerLine = [
      'import java.util.Stack;',
      'import java.util.Scanner;',
      'class PalindromeTest {',
      'public static void main(String[] args) {',
      'if(a>2){',
      'if(a>2){',
      'System.out.println("Es mayor que 2");',
      '}',
      'System.out.println("Es mayor que 2");',
      '}',
      'System.out.println("Es mayor que 2");',
      '}',
      '}',
      '}'
    ];

    initPosition = 0;
    endPosition = 14;
  });

  it('#executeJava debe devolverme un arreglo con las posiciones de inicio y de fin de alguna instruccion', () => {
    const resultExecuteJava = [
      ['if', 4, 9],
      ['if', 5, 7]
    ];
    // component.getPairInstructions(contentLinePerWord, contenFilePerLine, initPosition, endPosition);

    expect(component.pairInstruction.length).toBe(2);
  });



});
