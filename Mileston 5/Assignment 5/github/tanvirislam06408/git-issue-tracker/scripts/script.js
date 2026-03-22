// cards parent element
const issueCards = document.getElementById('issueCards');
// cards count
const cardsCount = document.getElementById('cardsCount');
const openIssues = [];
const closedIssues = [];

// loading 

const loading=(value)=>{
    if(value===true){
        document.getElementById('issueCards').classList.add('hidden')
        document.getElementById('spnner').classList.add('flex')
        document.getElementById('spnner').classList.remove('hidden')
    }
    else{
        document.getElementById('spnner').classList.add('hidden')
        document.getElementById('spnner').classList.remove('flex')
        document.getElementById('issueCards').classList.remove('hidden')
    }
}


const loadAllIssuesCard = async () => {
    loading(true);
    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
    const data = await res.json();
    openIssues.length = 0;
    closedIssues.length = 0;
    data.data.forEach(card => {
        if (card.status === "open") {
            openIssues.push(card);
        } else {
            closedIssues.push(card);
        }
    });
    displayCard(data.data);
    loading(false);
}

const displayCard = (data) => {
    // dynamic cards count
    cardsCount.innerText = ''
    cardsCount.innerText = data.length;
    // created new element and append it
    issueCards.innerHTML = ""
    data.forEach(card => {
        const div = document.createElement("div");
        div.id = `border-${card.id}`;
        div.className = 'card bg-base-100 max-w-96 shadow-sm border-t-4 border-green-500 h-full'
        div.innerHTML = `
         <div onclick="modal(${card.id})" class="card-body">

                        <div class="flex justify-between">
                            <img src=${card.status === 'open' ? './assets/Open-Status.png' : './assets/clonse.png'} alt="">
                            <div id="card-${card.id}" class="badge font-semibold bg-[#FEECEC] text-red-500">${card.priority.toUpperCase()}</div>
                        </div>
                        <h2 class="card-title">${card.title}</h2>
                        <p class="text-[#64748B]">${card.description}</p>
                        <div id="bug-${card.id}">
                            <div class="flex items-center gap-2" id="badgeParent-${card.id}">
                            </div>
                        </div>
                        <div class="card-actions justify-end border-t-2 border-gray-200 flex flex-col gap-1 mt-4 pt-5">
                            <p class="text-[#64748B] text-sm">${card.author}</p>
                            <p class="text-[#64748B] text-sm">${card.createdAt}</p>
                        </div>
                    </div>
        `
        issueCards.appendChild(div)
        const badgeParent = document.getElementById(`badgeParent-${card.id}`);
        badgeParent.innerHTML = ""
        card.labels.forEach(l => {
            const badge = document.createElement('div');
            if (l === "bug") {
                badge.innerHTML = `
                                    <div class="badge bg-[#FEECEC] text-red-500"><img src="./assets/BugDroid.png" alt="">${l.toUpperCase()}
                            </div>
                                    `
            }
            else if (l === "enhancement") {
                badge.innerHTML = `
            <div class="badge  bg-green-100 text-green-600"><i class="fa-solid fa-wand-magic-sparkles"></i><span>${l.toUpperCase()}</span></div>
            `
            }
            else if (l === "help wanted") {
                badge.innerHTML = `
                <div class="badge bg-[#FFF8DB] text-[#D97706]"><img src="./assets/Lifebuoy.png" alt="">${l.toUpperCase()}</div>
                `
            }
            else {
                badge.innerHTML = `
            <div class="badge  bg-gray-100 text-gray-600"><i class="fa-solid fa-circle-exclamation"></i><span>${l.toUpperCase()}</span></div>
            `
            }
            badgeParent.appendChild(badge);
        })



        // change border color depends on status
        const borderTop = document.getElementById(`border-${card.id}`);
        if (card.status === 'closed') {
            borderTop.classList.remove('border-green-500');
            borderTop.classList.add('border-[#A855F7]');
        }

        // dynamic priority set
        const dynamicPriority = document.getElementById(`card-${card.id}`);
        if (card.priority === "high") {
            dynamicPriority.classList.add('text-red-500', 'bg-[#FEECEC]');
            dynamicPriority.classList.remove('bg-[#FFF8DB]', 'text-[#D97706]')
        }
        else if (card.priority === "low") {
            dynamicPriority.classList.remove('text-red-500', 'bg-[#FEECEC]');
            dynamicPriority.classList.add('bg-gray-100', 'text-gray-500');
        }
        else {
            dynamicPriority.classList.remove('text-red-500', 'bg-[#FEECEC]');
            dynamicPriority.classList.add('bg-[#FFF8DB]', 'text-[#D97706]');
        }
        // dynamic bug fixed status
        const bugStatus = document.getElementById(`bug-${card.id}`);
        const statusBug = card.labels[0];
        if (statusBug !== "bug") {
            bugStatus.innerHTML = "";
            bugStatus.innerHTML = `
            <div class="badge  bg-green-100 text-green-600"><i class="fa-solid fa-wand-magic-sparkles"></i><span>ENHANCEMENT</span></div>
            `
        }



    });


}


// button toggle

document.getElementById('btn-open').addEventListener('click', () => {
    loading(true);
    setTimeout(()=>{
        displayCard(openIssues)
        loading(false);
    },200)
    btnToggle('btn-open');
})
document.getElementById('btn-closed').addEventListener('click', async() => {
    loading(true);
    setTimeout(() => {
        displayCard(closedIssues);
        loading(false);   
    }, 200);
    btnToggle('btn-closed');
})
document.getElementById('btn-all').addEventListener('click', () => {
    loadAllIssuesCard();
    btnToggle('btn-all');
})

const btnToggle = (id) => {
    const btn = document.getElementById(id);
    document.getElementById('btn-all').classList.remove('btn-primary', 'text-white');
    document.getElementById('btn-closed').classList.remove('btn-primary', 'text-white');
    document.getElementById('btn-open').classList.remove('btn-primary', 'text-white');
    btn.classList.add("btn-primary", "text-white");
}


// modal
const modal = async (id) => {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const data = await res.json();
    displayModal(data.data);


}

// display modal

const displayModal = (data) => {
    const modalParent = document.getElementById('my_modal_5');
    modalParent.innerHTML = "";
    modalParent.innerHTML = `
    <div class="modal-box mb-16 md:mb-0 md:w-9/12 md:min-w-4xl">
    <h3 class="text-2xl text-start font-bold">${data.title}</h3>
    <p class="py-4 text-sm font-bold text-gray-500 flex items-center gap-2">
    <span id="badge-${data.id}" class='badge bg-[#00A96E] text-white p-3'>${data.status.toUpperCase()}</span>
 
    <span>• Opened by ${data.assignee}</span> 
    <span>•${data.createdAt}</span></p>
    <div id="labelModal-${data.id}">
    </div>
    <p class='mt-3 text-gray-500'>${data.description}</p>

    <div class='flex gap-30 mt-6 bg-gray-100 p-5 rounded-xl'>
    <div class='font-bold text-sm'><p class='font-semibold mb-2 text-gray-500'>Assignee: </p> <p>${data.author}</p></div>
    <div>
    <div class='font-bold text-sm'>
    <p class='font-semibold mb-2 text-gray-500'>Priority: </p>
     <p class='badge' id='mod-${data.id}'>${data.priority.toUpperCase()}</p>
     </div>
     </div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn btn-primary">Close</button>
      </form>
    </div>
  </div>
    `

    let labelModal = document.getElementById(`labelModal-${data.id}`);
    // labelModal=''
    data.labels.forEach(l => {

        if (l === "bug") {
            labelModal.innerHTML += `
                                    <div class="badge bg-[#FEECEC] text-red-500"><img src="./assets/BugDroid.png" alt="">${l.toUpperCase()}
                            </div>
                                    `
        }
        else if (l === "enhancement") {
            labelModal.innerHTML += `
            <div class="badge  bg-green-100 text-green-600"><i class="fa-solid fa-wand-magic-sparkles"></i><span>${l.toUpperCase()}</span></div>
            `
        }
        else if (l === "help wanted") {
            labelModal.innerHTML += `
                <div class="badge bg-[#FFF8DB] text-[#D97706]"><img src="./assets/Lifebuoy.png" alt="">${l.toUpperCase()}</div>
                `
        }
        else {
            labelModal.innerHTML += `
            <div class="badge  bg-gray-100 text-gray-600"><i class="fa-solid fa-circle-exclamation"></i><span>${l.toUpperCase()}</span></div>
            `
        }

        const badge = document.getElementById(`badge-${data.id}`);
        if (data.status === 'closed') {
            badge.classList.remove('bg-[#00A96E]');
            badge.classList.add('bg-[#A855F7]');
        }
        // dynamic priority set
        const mod = document.getElementById(`mod-${data.id}`);
        if (data.priority === "high") {
            mod.classList.add('text-red-500', 'bg-[#FEECEC]');
            mod.classList.remove('bg-[#FFF8DB]', 'text-[#D97706]')
        }
        else if (data.priority === "low") {
            mod.classList.remove('text-red-500', 'bg-[#FEECEC]');
            mod.classList.add('bg-white', 'text-gray-500');
        }
        else {
            mod.classList.remove('text-red-500', 'bg-[#FEECEC]');
            mod.classList.add('bg-[#FFF8DB]', 'text-[#D97706]');
        }
    })
    // call the modal
    my_modal_5.showModal();

}


// search function
const loadSearchData = async (searchKey) => {

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchKey}`);
    const data = await res.json();
    displayCard(data.data);


}

const input = document.getElementById('searchValue');
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (input.value === "") {
            return;
        }
        loadSearchData(input.value);

    }

})
document.getElementById('searchBtn').addEventListener('click', () => {
    if (input.value === "") {
        return;
    }
    loadSearchData(input.value);

})




loadAllIssuesCard();
