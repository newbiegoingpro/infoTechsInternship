import { data } from "./utils/constants.js";

const table = document.querySelector('.table'); //selected table element
const rowElement = document.querySelector('.table__row_template'); //selected template element
const tableHeadings = document.querySelectorAll('.table__heading'); //selected table headings
const modal = document.querySelector(".modal"); //selected modal
const inputs = Array.from(modal.querySelectorAll('input'));
const hideBtns = Array.from(document.querySelectorAll('.hide__btn'));
const closeBtn = document.querySelector(".modal__close");
const moreBtn = document.querySelector('.more__btn');

let counter = 0; //for slicing init data 

function getRow(e) {
    let row = rowElement.content.cloneNode(true); //cloning template row

    const firstname = row.querySelector('.firstname');
    const lastname = row.querySelector('.lastname');
    const eyeColor = row.querySelector('.eyeColor');
    const about = row.querySelector('.about');
    row.querySelector('tr').setAttribute('id', e['id'].toString()) //assigning id

    firstname.innerText = e.name.firstName; //inserting data
    lastname.innerText = e.name.lastName;
    eyeColor.style.backgroundColor = e.eyeColor; // setting background color
    about.innerText = e.about;

    return row; //returning row with JSON-provided data
}

function renderRows() {
    let firstPage = data.slice(counter, counter + 10); //slicing init data
    const rows = firstPage.map(e => getRow(e)); // passing object to getRow() each iteration 
    table.append(...rows); //inserting rows into the table
}

function sortRows(rowToSort, id) {
    let sortedRows = Array.from(table.rows)
        .slice(1)
        .sort((rowA, rowB) => {
            if (id == 4) {// when called for 4th column will use style.backgroundColor for sorting
                return rowA.cells[rowToSort].style.backgroundColor > rowB.cells[rowToSort].style.backgroundColor ? 1 : -1;
            }
            return rowA.cells[rowToSort].innerText > rowB.cells[rowToSort].innerText ? 1 : -1;
        }) // rowToSort is a num which determines the index of a cell to sort

    table.tBodies[0].append(...sortedRows);
}

function addEventListeners() {
    tableHeadings.forEach(el => el.addEventListener('click', (e) => {
        //depending on e.target.innerText passing arg to sortRows()
        if (e.target.innerText.includes('Имя')) {
            sortRows(0);
        } else if (e.target.innerText.includes('Фамилия')) {
            sortRows(1);
        } else if (e.target.innerText.includes('Описание')) {
            sortRows(2);
        } else {
            sortRows(3, 4);
        }

    }));

    table.addEventListener("click", (e) => {
        let rowToUpdate = Array.from(document.querySelectorAll("tr")).find(row => e.target.closest('tr').id == row.id).cells;
        if (e.target.classList.contains('table__cell')) { //delegating event handling to parent element
            modal.classList.add("modal_opened");
            modal.setAttribute("id", e.target.closest('tr').id); //setting modals id equal to the id of row to update so i can find row and update it on form submit
            for (let i = 0; i < rowToUpdate.length; i++) {
                inputs[i].value = rowToUpdate[i].innerText; //setting inputs values        
            }
        }
    })

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("modal_opened");
    });

    modal.addEventListener('submit', (e) => {
        e.preventDefault();
        let id = Array.from(document.querySelectorAll('tr')).find(row => row.id == modal.id).id; //finding row's id using modal's id that was set earlier 
        let rowToUpdate = Array.from(document.getElementById(id).cells); //finding row's cells
        console.log(rowToUpdate);
        for (let i = 0; i < inputs.length; i++) {
            rowToUpdate[i].innerText = inputs[i].value; //setting row's new values        
        }
    });

    moreBtn.addEventListener('click', () => {
        counter = counter + 10; //updating counter
        renderRows(); //calling render with new counter value data.slice(10, 20)...
    });

    let isFirstVisible = true;
    let isSecondVisible = true;
    let isThirdVisible = true;
    let isForthVisible = true; // initial states



    /*function handleColumnVisibility(column) {
            column.forEach(el => isVisible ? el.style.visibility = 'hidden' : el.style.visibility = 'visible');
            isVisible = !isVisible; //switching state
    } /*PROBLEM HERE so this function is only partially working----- after hiding 1st column it hides 2nd only when clicking btn twice due to visibility 
    state beign binded to single boolean value... which goes from initial true to false and so on ------ for solution different approach might be required*/

    function handleColumnVisibility(column, evTarget) {
        if (evTarget.id == 1) {
            column.forEach(el => {
                isFirstVisible ? el.style.visibility = 'hidden' : el.style.visibility = 'visible';
                isFirstVisible ? evTarget.innerText = 'show' : evTarget.innerText = 'hide';
                return
            })
            isFirstVisible = !isFirstVisible
        } else if (evTarget.id == 2) {
            column.forEach(el => {
                isSecondVisible ? el.style.visibility = 'hidden' : el.style.visibility = 'visible';
                isSecondVisible ? evTarget.innerText = 'show' : evTarget.innerText = 'hide';
                return
            })
            isSecondVisible = !isSecondVisible
        } else if (evTarget.id == 3) {
            column.forEach(el => {
                isThirdVisible ? el.style.visibility = 'hidden' : el.style.visibility = 'visible';
                isThirdVisible ? evTarget.innerText = 'show' : evTarget.innerText = 'hide';
                return
            })
            isThirdVisible = !isThirdVisible
        } else {
            column.forEach(el => {
                isForthVisible ? el.style.visibility = 'hidden' : el.style.visibility = 'visible';
                isForthVisible ? evTarget.innerText = 'show' : evTarget.innerText = 'hide';
                return
            })
            isForthVisible = !isForthVisible
        } /// HAVING A SEPARATE HANDLER FOR EACH COLUMN IS KINDA BAD AND GOES AGAINS DRY-METHOD BUT IT WORKS THAT WAY 
    }


    hideBtns.forEach(e => e.addEventListener("click", (e) => {
        let column = [];

        if (e.target.id == '1') {

            let firstNames = Array.from(document.querySelectorAll('.firstname'));
            column.push(...firstNames); //defining which elements to hide
            handleColumnVisibility(column, e.target)
        } else if (e.target.id == '2') {

            let lastNames = Array.from(document.querySelectorAll('.lastname'));
            column.push(...lastNames);
            handleColumnVisibility(column, e.target)
        } else if (e.target.id == '3') {

            let abouts = Array.from(document.querySelectorAll('.about'));
            column.push(...abouts);
            handleColumnVisibility(column, e.target)
        } else {

            let eyeColors = Array.from(document.querySelectorAll('.eyeColor'));
            column.push(...eyeColors);
            handleColumnVisibility(column, e.target)
        }
    }))
};



renderRows();
addEventListeners();