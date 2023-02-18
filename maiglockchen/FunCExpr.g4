grammar FunCExpr;

// Определение правил
expression: term ((PLUS | MINUS) term)* ;
term: factor ((MULT | DIV) factor)* ;
factor: INTEGER | LPAREN expression RPAREN ;

// Определение токенов
LPAREN : '(' ;
RPAREN : ')' ;
PLUS : '+' ;
MINUS : '-' ;
MULT : '*' ;
DIV : '/' ;
INTEGER : ('0'..'9')+ ;

// Пропуск пробелов
WS : [ \t\n\r]+ -> skip ;