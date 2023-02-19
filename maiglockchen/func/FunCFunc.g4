grammar FunCFunc;

// Определение правил
program: function+ ;
function: FUNCTION ID LPAREN parameters? RPAREN returnType? block ;
parameters: ID (COMMA ID)* ;
returnType: COLON ID ;
block: LBRACE statement* RBRACE ;
statement: assignment | expression | ifStatement | whileStatement | returnStatement ;
assignment: ID ASSIGN expression ;
ifStatement: IF LPAREN expression RPAREN block (ELSE block)? ;
whileStatement: WHILE LPAREN expression RPAREN block ;
returnStatement: RETURN expression SEMICOLON ;

// Определение токенов
FUNCTION : 'function' ;
ID : [a-zA-Z]+ ;
LPAREN : '(' ;
RPAREN : ')' ;
COMMA : ',' ;
COLON : ':' ;
LBRACE : '{' ;
RBRACE : '}' ;
IF : 'if' ;
ELSE : 'else' ;
WHILE : 'while' ;
RETURN : 'return' ;
ASSIGN : '=' ;
SEMICOLON : ';' ;

// Пропуск пробелов и комментариев
WS : [ \t\r\n]+ -> skip ;
COMMENT : '/*' .*? '*/' -> skip ;