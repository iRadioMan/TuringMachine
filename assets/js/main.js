function isEmpty(str) {
	if (str.trim() == '') 
	  return true;
	  
	return false;
}

$("#start_button").click(testMachine);


function testMachine() {
	let pr = $("#input_program").val();
	if (isEmpty(pr)) return;

	/* Исходная лента */
	let tape = $("#input_tape").val();
	if (isEmpty(tape)) return;

	/* Флаг отладки */
	let debug = $("#debug_check").prop('checked');

	/* Инициализируем объекты классов */
	let program = new TuringProgram();
	program.initialize(pr);

	let tu = new TuringMachine();
	tu.initialize(tape, program);
	
	/* Запускаем машину, сохраняем результат */
	let res = tu.start(debug);
	$("#result_text").val(res);
}