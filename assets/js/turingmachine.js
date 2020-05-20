function isDigit(aChar) {
      myCharCode = aChar.charCodeAt(0);
   
      if((myCharCode > 47) && (myCharCode <  58))
      {
         return true;
      }
   
      return false;
}

class TuringProgram {
	constructor() {
		this.program = [];
		this.initialized = false;
		this.errors = [];
	}

	getFirstQ(cmd, n) {
		if (cmd[0] != 'q') {
			let err = 'Ошибка синтаксиса: команда ' + (n + 1) +' должна начинаться с q!';
			if (!this.errors.includes(err)) this.errors.push(err);
		}

		let i = 1;
		let firstQ = '';

		/* Если второй символ не цифра, то ошибка */
		if (!isDigit(cmd[1])) {
			let err = 'Ошибка синтаксиса: отсутствует первичное состояние в команде ' + (n + 1) +'!';
			if (!this.errors.includes(err)) this.errors.push(err);
		}

		/* Добавляем символы, пока у нас идут цифры (это все номер состояния q) */
		while (isDigit(cmd[i])) {
			firstQ += cmd[i];
			++i;

			/* Если дошли до конца и везде только числа, выдаем ошибку */ 
			if (i > (cmd.length - 1)) {
				let err = 'Ошибка синтаксиса: неверная команда ' + (n + 1) +'!';
				if (!this.errors.includes(err)) this.errors.push(err);
				break;
			}
		}

		firstQ = parseInt(firstQ);
		
		/* Проверяем число. Если получили NaN, то выдаем ошибку. Также выдаем ошибку, если у нас отрицательное число */
		if (firstQ === NaN) {
			let err = 'Ошибка синтаксиса: неправильно задано новое состояние в команде ' + (n + 1) +' (ошибка преобразования числа)!';
			if (!this.errors.includes(err)) this.errors.push(err);
		}
		else if (firstQ < 0) {
			let err = 'Ошибка синтаксиса: неправильно задано новое состояние в команде ' + (n + 1) +' (получено отрицательное число)!';
		}

		return firstQ;
	}

	getFirstE(cmd, n) {
		let i = 1;
		let firstE = '';

		/* Доходим от начала до первого символа, пропуская все цифры */
		while (isDigit(cmd[i])) { 
			++i;

			/* Если дошли до конца и везде только числа, выдаем ошибку */ 
			if (i > (cmd.length - 1)) {
				let err = 'Ошибка синтаксиса: неверная команда ' + (n + 1) +'!';
				if (!this.errors.includes(err)) this.errors.push(err);
				break;
			}
		}

		/* Добавляем символы к результату, пока не встретим - */
		while (cmd[i] != '-') {
			firstE += cmd[i];
			++i;

			/* Если дошли до конца и - нету, выдаем ошибку */ 
			if (i > (cmd.length - 1)) {
				let err = 'Ошибка синтаксиса: отсутствует знак - в команде ' + (n + 1) +'!';
				if (!this.errors.includes(err)) this.errors.push(err);
				break;
			}
		}

		/**
		 * Если длина результата больше двух символов, то ошибка, так как два символа лишь в одном случае - a0
		 * Если длина меньше 1 символа, то тоже ошибка
		 **/
		if (firstE.length > 2 || firstE.length < 1) {
			let err = 'Ошибка синтаксиса: в команде ' + (n + 1) +' обозреваемый символ указан некорректно!';
			if (!this.errors.includes(err)) this.errors.push(err);
		}

		/* Если обозреваемый символ a0, то это пробел */
		if (firstE == 'a0') firstE = ' ';

		return firstE;
	}

	getNewCmd(cmd, n) {
		/* q1a0-a0q2 */
		/* q1a0-aq222 */
		let i = cmd.length - 1;
		let j = 1;
		let newCmd = '';

		/* Двигаясь в обратном порядке доходим до q, сдвигаем еще на 1 */
		while (cmd[i] != 'q') {
			--i;

			/* Если дошли до самого начала, то нового q нету, выдаем ошибку */
			if (i < 1) {
				let err = 'Ошибка синтаксиса: не найдено новое состояние в команде ' + (n + 1) +'!';
				if (!this.errors.includes(err)) this.errors.push(err);
				break;
			}
		}
		--i;

		/* Если уперлись в -, значит новой команды не было */
		if (cmd[i] == '-') {
			let err = 'Ошибка синтаксиса: отсутствует новая команда для машины в команде ' + (n + 1) +'!';
			if (!this.errors.includes(err)) this.errors.push(err);
		}

		/* Двигаясь в прямом порядке доходим до -, сдвигаем еще на 1 */
		while (cmd[j] != '-') {
			newCmd = cmd[j] + newCmd;
			++j;

			/* Если дошли до конца и - нету, выдаем ошибку */ 
			if (j > (cmd.length - 1)) {
				let err = 'Ошибка синтаксиса: отсутствует знак - в команде ' + (n + 1) +'!';
				if (!this.errors.includes(err)) this.errors.push(err);
				break;
			}
		}
		++j;

		/* Вырезаем новую команду, ориентируясь по i и j */
		newCmd = cmd.substr(j, i - j + 1);

		/* Преобразовываем команду к необходимому виду, если она равна a0 */
		if (newCmd == 'a0') newCmd = ' ';

		return newCmd;
	}

	getNewQ(cmd, n) {
		let i = cmd.length - 1;
		let newQ = '';

		/* Если команда оканчивается не на число, то выдаем ошибку */
		if (!isDigit(cmd[i])) {
			let err = 'Ошибка синтаксиса: неправильно задано новое состояние в команде ' + (n + 1) +'!';
			if (!this.errors.includes(err)) this.errors.push(err);
		}

		/* Двигаясь в обратном порядке правильно дописываем число */
		while (isDigit(cmd[i])) {
			newQ = cmd[i] + newQ;
			--i;

			/* Если дошли до начала и везде только числа, выдаем ошибку */ 
			if (i < 1) {
				let err = 'Ошибка синтаксиса: неверная команда ' + (n + 1) +'!';
				if (!this.errors.includes(err)) this.errors.push(err);
				break;
			}
		}

		/* Приводим к числу */
		newQ = parseInt(newQ);

		/* Проверяем число. Если получили NaN, то выдаем ошибку. Также выдаем ошибку, если у нас отрицательное число */
		if (newQ === NaN) {
			let err = 'Ошибка синтаксиса: неправильно задано новое состояние в команде ' + (n + 1) +' (ошибка преобразования числа)!';
			if (!this.errors.includes(err)) this.errors.push(err);
		}
		else if (newQ < 0) {
			let err = 'Ошибка синтаксиса: неправильно задано новое состояние в команде ' + (n + 1) +' (получено отрицательное число)!';
			if (!this.errors.includes(err)) this.errors.push(err);
		}

		return newQ;
	}

	getErrors() {
		if (this.errors.length == 0) return 'Ошибок нет!';
		else return this.errors;
	}

	initialize(src) {
		/* Получаем список всех команд, разделенных запятыми, убирая при этом пробелы */
		src = src.replace(/\s/g, '');
		let commands = src.split(',');;

		/** 
		 * Получаем список символов внешнего алфавита, чтобы знать количество строк в таблице.
		 * Изначально уже есть пробел (символ a0). Также получаем максимальное значение состояния
		 **/
		let E = [' '];
		let maxQ = 0;
		for (let i = 0; i < commands.length; ++i) {
			/* Получаем символ внешнего алфавита и состояние q из данной команды */
			let newE = this.getFirstE(commands[i], i);
			let newQ = this.getFirstQ(commands[i], i);

			/* Если внешний алфавит не содержит символа из данной команды, то добавляем его */
			if (!E.includes(newE)) E.push(newE);

			/* Если новое q больше, то записываем его */
			if (newQ > maxQ) maxQ = newQ;
		}

		/** 
		 * В итоге мы получили необходимые данные для построения таблицы нужного размера.
		 * Создаем основу с символами внешнего алфавита и пустыми ячейками 
		 **/
		for (let i = 0; i < E.length; ++i) {
			let newRow = [];

			for (let j = 0; j <= maxQ; ++j) {
				if (j == 0) newRow.push(E[i]);
				else newRow.push('--');
			}

			this.program.push(newRow);
		}

		/**
		 * Заполняем таблицу
		 **/
		for (let i = 0; i < commands.length; ++i) {
			/* Определяем переменные, определяем столбец для новой команды */
			let firstE = this.getFirstE(commands[i], i);
			let column = this.getFirstQ(commands[i], i);
			let row;

			/* Ищем строку по символу внешнего алфавита */
			for (let r = 0; r < this.program.length; ++r) {
				if (this.program[r][0] == firstE)
					row = r;
			}

			/* Заполняем ячейку новой командой и состоянием */
			this.program[row][column] = this.getNewCmd(commands[i], i) + this.getNewQ(commands[i], i);
		}

		/* Ставим флажок, что программа проверена и успешно инициализирована */
		this.initialized = true;
	}
}

class TuringMachine {
	constructor() {
		this.tape = null;
		this.initialized = false;
		this.program = [];
		this.errors = [];
		this.q = 1;
		this.i = 0;
		this.eop = false;
		this.result = '';
	}

	initialize(T, P) {
		this.tape = T;
		this.program = P.program;
		this.initialized = true;
		this.errors = P.errors;
	}

	start(debug = false) {
		/* Если машина не инициализирована программой и лентой, то выдаем ошибку */
		if (!this.initialized) return 'Ошибка: данная машина Тьюринга не инициализирована!';

		/* Если машина обнаружит в программе ошибки, то выводим их */
		if (this.errors.length != 0) {
			let errString = '';
			for (let i = 0; i < this.errors.length; ++i) {
				errString = errString + '[' + (i + 1) + '] ' + this.errors[i] + '\n';
			}
			return errString;
		}

		/* Общий бесконечный цикл с условием выхода q = 0 */
		while (!this.eop) {
			/* Код для вставки пустого символа (пробела) в начало и конец ленты */
			if (this.i == -1) {
				this.tape = " " + this.tape;
				this.i = 0;
			} 
			else if (this.i == this.tape.length) {
				this.tape = this.tape + " ";
				this.i = this.tape.length - 1;
			}	

			/* Если включена отладка, то записываем каждый шаг в результат */
			if (debug) this.debugStep();

			/**
			 * Переменная строки в таблице программы, по умолчанию -1, так как 
			 * необходимо найти строку по символу внешнего алфавита. 
			 * Столбец всегда совпадает с состоянием машины
			 **/
			let row = -1;			
			
			/* Поиск строки по символу внешнего алфавита на ленте, на котором стоит каретка */
			for (let r = 0; r < this.program.length; ++r) {
				if (this.program[r][0] == this.tape[this.i])
					row = r;
			}

			/** 
			 * Если так случилось, что символ внешнего алфавита не найден в таблице программы,
			 * то выдаем ошибку и завершаем работу
			 **/
			if (row == -1) {
				this.eop = true;
				return 'Ошибка в программе P: символ внешнего алфавита на ленте [' + 
				this.tape[this.i] + '] не найден в исходной программе...';
			}
			
			/* Получаем команду из таблицы программы */
			let command = this.program[row][this.q];
			
			/* Определяем команду */
			switch (command[0]) {
				/** Если так получилось, что мы наткнулись на пустую ячейку программы,
				 * то это значит, что в исходной программе ошибка. Выдаем сообщение и
				 * завершаем работу
				 **/
				case '-':
				case '':
					this.eop = true;
					this.result += 'Ошибка в программе P: машина обратилась к пустой ячейке [' +
					this.program[row][0] + ', ' + this.q + ']! Остановка...\n';
					break;

				/* Сдвиг каретки вправо */
				case 'R':
					this.i++;
					break;
				
				/* Сдвиг каретки влево */
				case 'L':
					this.i--;
					break;
				
				/* Получение символа для записи на ленту */
				default:
					this.tape = this.tape.substr(0, this.i) + command[0] + this.tape.substr(this.i + 1);
					break;
			}

			/* Меняем состояние машины, получая все оставшиеся из команды */
			this.q = parseInt(command.substr(1));

			/* Если машина перешла в состояние 0, то завершаем работу */
			if (this.q == 0) { 
				this.eop = true;
				
				/* Если включена отладка, запишем последний шаг в результат */
				if (debug) this.debugStep();
			}
		}

		/* Если включена отладка, то выводим все шаги, если нет - только ленту */
		if (debug) this.result = this.result + "Результат: " + this.tape.trim();
		else this.result += this.tape.trim();
		this.eop = false;
		
		return this.result;
	}

	debugStep() {
		let t = '';

		/* Для q в первую строку вставляем количество пробелов равное i */
		for (let a = 0; a < this.i; t += ' ', ++a);

		/* Затем вписываем само значение q и переходим на следующую строку */
		t = t + ' q' + this.q + '\n';

		/* Печатаем посимвольно всю ленту, когда доходим до i, берем символ в скобки (на нем стоит каретка) */
		for (let a = 0; a < this.tape.length; ++a) {
			if (a == this.i) t = t + '[' + this.tape[a] + ']';
			else t += this.tape[a];
		}
		this.result = this.result + t + '\n\n';
	}
}