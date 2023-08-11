// time picker code
//https://www.youtube.com/watch?v=97lSkxy7Wjk


function performFilemakerFromJS() {
    
    // need to somehow access this function from here, use to send chosen time back to FM 
    FileMaker.PerformScript("filemaker script name", timeParam);
}

function buildPicker(timePickable) {

    const picker = document.createElement("div");
    const hourOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(numberToOption);
    const minuteOptions = [0, 5, 10, 15, 25, 30, 35, 40, 45, 50, 55].map(numberToOption);

    picker.classList.add("time-picker");
    picker.innerHTML = `
    <select class="time-picker__select">
        ${hourOptions.join("")}
        </select>
        
        <select class="time-picker__select">
        ${minuteOptions.join("")}
        </select>
        
        <select class="time-picker__select">
       <option value = "am">am</option>
       <option value = "pm">pm</option>
        </select>
        `;

    const selects = getSelectsFromPicker(picker);

    selects.hour.addEventListener("change", () => timePickable.value = getTimeStringFromPicker(picker));
    selects.minute.addEventListener("change", () => timePickable.value = getTimeStringFromPicker(picker));
    selects.meridiem.addEventListener("change", () => timePickable.value = getTimeStringFromPicker(picker));

    if(timePickable.value) {

        const {hour, minute, meridiem} = getTimePartsFromPickable(timePickable);
        selects.hour.value = hour;
        selects.minute.value = minute;
        selects.meridiem.value = meridiem;
    } 

    
    return picker;
}

function getTimePartsFromPickable(timePickable) {

    //12:45pm
    const pattern = /^(\d+):(\d+) (am|pm)$/;

    const [hour, minute, meridiem] = Array.from(timePickable.value.match(pattern)).splice(1);


    return {
        hour,
        minute,
        meridiem 
    };

}

function getSelectsFromPicker(timePicker) {
    const [hour, minute, meridiem] = timePicker.querySelectorAll(".time-picker__select");

    return {
        hour,
        minute,
        meridiem
    }

}

function getTimeStringFromPicker(TimePicker) {

    const selects = getSelectsFromPicker(TimePicker);

    return `${selects.hour.value}:${selects.minute.value} ${selects.meridiem.value}`;

}

function numberToOption(number) {
    const padded = number.toString().padStart(2, "0");

    return `<option value="${padded}">${padded}</option>`;
}

function show(timePickable) {
    const picker = buildPicker(timePickable);

    const {bottom: top, left} = timePickable.getBoundingClientRect();

    picker.style.left = `${left}px`;
    picker.style.top = `${top}px`;

    document.body.appendChild(picker);

    return picker;

}

export function activate() {
    document.head.insertAdjacentHTML("beforeend", ` 
    <style>
        .time-picker {
        position: absolute;
        display: inline-block;
        padding: 10px;
        background-color: lightgray;
        border-radius: 6px;
        }

        .time-picker__select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        outline: none;
        text-align: center;
        border: 1px solid #dddddd;
        padding: 6px 10px;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        font-family: 'Heebo', sans-serif;
        }
    </style>
    `);

    document.querySelectorAll(".time-pickable").forEach(timePickable => {
        let activePicker = null;

        timePickable.addEventListener("focus", () => {
            if(activePicker) return;

            activePicker = show(timePickable);
            
            const onClickAway = ({target}) => {
                if(target === activePicker || target === timePickable || activePicker.contains(target) ) return;

                document.removeEventListener("mousedown", onClickAway);
                document.body.removeChild(activePicker);
                
                // send Filemaker the selected time when the user clicks away from the picker
                FileMaker.PerformScript("show", getTimeStringFromPicker(activePicker));

                //set active picker to null
                activePicker = null;
            };

            document.addEventListener("mousedown", onClickAway);
        });
    });
}

