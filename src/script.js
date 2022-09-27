const API = "https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/";
const regForm = document.getElementById("reg_form");

const controller = async (path, method = "GET", body) => {
    const URL = API + path;

	const params = {
		method,
		headers: {
			"content-type": "application/json",
		}
	}

	if(body) {
		params.body = JSON.stringify(body);
	}

	let request = await fetch(URL, params);
	let response = await request.json();

	return response;
}


// Registration


regForm.addEventListener("submit", async e => {
	e.preventDefault();
    
    const studentName = regForm.querySelector("#new_student_name").value;
  
    const body =  {
        name: studentName,
        "marks":[0,0,0,0,0,0,0,0,0,0],
        "email":"first{{i}}.last{{i}}@mail.com",
    };

    controller("/students", "POST", body)
        .then(data => {
            let newStudent = new Student(data);
            newStudent.renderStudent();
        })
})


// class Student


const tbody = document.getElementById("tbody");

class Student {
    constructor(obj) {
        for(let key in obj) {
            this[key] = obj[key];
        }
    }

    renderStudent() {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${this.name}</td>`;

        for(let i = 0; i < this.marks.length; i++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.value = this.marks[i];
            input.addEventListener("change", async () => {
                console.log(input.value);
                this.marks[i] = input.value;
                console.log(this.marks);
                const body =  {
                    marks: this.marks
                }
                const response = await controller(`/students/${this.id}`, "PUT", body)
            })
            td.append(input)
            tr.append(td)
        }

        // this.marks.map(
        //     function (data, index) {
        //         const td = document.createElement("td");
        //         const input = document.createElement("input");
        //         input.value = data;
        //         input.addEventListener("change", async () => {
        //             console.log(data, index, input.value);
        //             const body =  {
        //                 marks: this.marks
        //             }
        //             const response = await controller(`/students/${tr.id}`, "PUT", body)
        //         })
        //         td.append(input)
        //         tr.append(td)
        // })
        const td = document.createElement("td")
        td.innerHTML += `<button>Delete</button>`;
        tr.append(td);
        const deleteButton = tr.querySelector("button")

        tbody.append(tr);
        
        this.deleteStudent(deleteButton, tr);
    }

    deleteStudent(deleteButton, tr) {
        deleteButton.addEventListener("click", async () => {
			const response = await controller(`/students/${this.id}`, "DELETE");

			if(response.id) {
                console.log(response.id);
                tr.innerHTML = "";
			}
		})
    }
}


// Start


controller("/students")
    .then(data => {
        console.log(data);
        data.map(elem =>{
            let student = new Student(elem);
            student.renderStudent();
        })
    })