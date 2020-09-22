$(function () {
	$('.items-slider').slick({
		infinite: true,
		fade: true,
		slidesToShow: 1,
		prevArrow: $('.nav-items__prev'),
		nextArrow: $('.nav-items__next'),
		dots: true,
		asNavFor: '.nav-items__slider',
	});

	$('.nav-items__slider').slick({
		infinite: true,
		fade: true,
		slidesToShow: 1,
		arrows: false,
		dots: false,
		asNavFor: '.items-slider',
	});

	$('.body-content__categories').slick({
		infinite: false,
		slidesToShow: 8,
		slidesToScroll: 1,
		arrows: false,
		dots: false,
		responsive: [
			{
				breakpoint: 992,
				settings: {
				  slidesToShow: 6,
				}
			  },
			  {
				breakpoint: 768,
				settings: {
				  slidesToShow: 4,
				}
			  },
			  {
				breakpoint: 560,
				settings: {
				  slidesToShow: 3,
				}
			  },
			  {
				breakpoint: 470,
				settings: {
				  slidesToShow: 2,
				}
			  },
			  {
				breakpoint: 391,
				settings: {
				  slidesToShow: 7,
				}
			  },
		]
	});
});

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());

const headerMenu = document.querySelector('.header__menu'),
	headerMenuBody = document.querySelector('.header__menu-body'),
	bodyContentCircle = document.querySelectorAll('.body-content__circle'),
	bodyMenuClose = document.querySelector('.body-menu__close');

const select = function () {
	const selectHeader = document.querySelectorAll('.select-header'),
		selectItem = document.querySelectorAll('.select-body__item');

	const selectToggle = function (e) {
		this.parentElement.classList.toggle('active');
		if (this.parentElement.classList.contains('active')) {
			document.querySelector('.select-header__icon').classList.add('active');
		} else {
			document.querySelector('.select-header__icon').classList.remove('active');
		}
	};

	const selectChoose = function () {
		const text = this.innerHTML,
			select = this.closest('.select'),
			currentText = this.closest('.select').querySelector('.select-header__current');

		currentText.innerHTML = text;
		select.classList.remove('active');
		document.querySelector('.select-header__icon').classList.remove('active');
	};

	if (document.querySelector('.select')) {
		document.addEventListener('click', (e) => {
			if (!e.target.closest('.select')) {
				document.querySelector('.select').classList.remove('active');
				document.querySelector('.select-header__icon').classList.remove('active');
			}
		});
	}

	selectHeader.forEach(item => {
		item.addEventListener('click', selectToggle);
	});

	selectItem.forEach(item => {
		item.addEventListener('click', selectChoose);
	});
};

select();

// for (let i = 0; i < bodyContentCircle.length; i++) {
// 	bodyContentCircle[i].addEventListener('click', (e) => {
// 		// if (bodyContentCircle[i] != this) {
// 		// 	bodyContentCircle[i].classList.add('active');
// 		// } else {
// 		// 	bodyContentCircle[i].classList.remove('active');
// 		// }
// 		if (e.target.closest('.body-content__categories')) {
// 			bodyContentCircle[i].classList.add('active');
// 		} else if (bodyContentCircle[i] != this) {
// 			bodyContentCircle[i].classList.remove('active');
// 		}
// 	});
// }



headerMenu.addEventListener('click', () => {
	headerMenuBody.classList.add('active');
	document.body.style.overflow = 'hidden';
});

bodyMenuClose.addEventListener('click', () => {
	headerMenuBody.classList.remove('active');
	document.body.style.overflow = 'visible';
});

