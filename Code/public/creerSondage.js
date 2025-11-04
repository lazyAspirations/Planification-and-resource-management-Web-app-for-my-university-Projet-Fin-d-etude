    /////////////////////////////////////////////////////////////////////////////start modal /////////////////////////////////////////////////////////////////////////////
        //modal
        var modal = document.getElementById("myModal");

        // Get the button that opens the modal
        let btn = document.getElementById("creerS");

        // Get the close button
        var span = document.getElementsByClassName("close")[0];

        // Open modal when button is clicked
        btn.onclick = function() {
            modal.style.display = "block";
            styleSelect();
        }

        // Close modal when 'X' is clicked
        span.onclick = function() {
            modal.style.display = "none";
            resetModal();

        }

        // Close modal when clicking outside of it
        window.onclick = function Close(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                resetModal();
            }      
        }

    //////////////////////////////////////////////////////////////////////////////end modal /////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////add/remove option/////////////////////////////////////////////////////////////////////////////
        let x=2;
        function ajouter(){
            if(x<4){
                const di=document.createElement('div');
                di.className='option';
                di.draggable = true; // trej3ha draggable

                di.addEventListener('dragstart', () => di.classList.add('dragging'));
                di.addEventListener('dragend', () => di.classList.remove('dragging'));

                const icon=document.createElement('i');
                icon.className="fas fa-bars";
                di.appendChild(icon);


            //inputtext
                const inpt=document.createElement('input');
                inpt.type='text';
                inpt.maxLength='25';
                inpt.minLength='1';
                inpt.className="answer";
                inpt.placeholder="Select an option";
                di.appendChild(inpt)

            //button
                const spanX=document.createElement('span');
                spanX.onclick = function() {
                    remove(this);
                };
                spanX.className='removeopt';
                spanX.innerHTML='&times;';
                di.appendChild(spanX);
                const options = document.querySelectorAll(".option");
                const lastOption = options[options.length - 1];//option lekhra
                lastOption.insertAdjacentElement('afterend',di)//nzido mor l option lehra
                x++;        
                if(x === 4){document.getElementById('ajouter').remove();}

            }

        }

        function remove(btn){
            const optionDiv = btn.closest(".option");
            if (optionDiv && x>2) {    
                optionDiv.remove();
                if(x === 4) {
                    const ajout = document.createElement('button');
                    ajout.type = 'button';
                    ajout.id = 'ajouter';
                    ajout.onclick = function() {
                        ajouter(this);
                    };            
                    const spn = document.createElement('span');
                    spn.className = "ajouter-btn";
                    spn.textContent = "+";
                    
                    ajout.appendChild(spn);
                    ajout.appendChild(document.createTextNode('ajouter une option'));
                
                    document.getElementById('submitBtn').insertAdjacentElement('beforebegin', ajout);
                }
                    x--;
            }
        }
        //////////////////////////////////////////////////////////////////////////////start drag/////////////////////////////////////////////////////////////////////////////
        document.addEventListener('DOMContentLoaded', function () {
            const container = document.querySelector('.options');
        
            function addDragEvents(option) {
                option.draggable = true;
                option.addEventListener('dragstart', () => option.classList.add('dragging'));
                option.addEventListener('dragend', () => option.classList.remove('dragging'));
            }
        
            function dragOver(e) {
                e.preventDefault();
                const dragging = document.querySelector('.dragging');
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) {
                    container.appendChild(dragging);
                } else {
                    container.insertBefore(dragging, afterElement);
                }
            }
        
            function getDragAfterElement(container, y) {
                const options = container.querySelectorAll('.option:not(.dragging)');
                let closestElement = null;
                let closestDistance = -Infinity;
            
                for (const option of options) {
                    const rect = option.getBoundingClientRect();
                    const middleY = rect.top + rect.height / 2;
                    const distance = y - middleY;
            
                    if (distance < 0 && distance > closestDistance) {
                        closestDistance = distance;
                        closestElement = option;
                    }
                }
            
                return closestElement;
            }
            document.querySelectorAll('.option').forEach(addDragEvents);
            container.addEventListener('dragover', dragOver);
            container.addEventListener('drop', e => e.preventDefault());
        }); 
        //////////////////////////////////////////////////////////////////////////////end drag/////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////start creation/////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////debut get select////////////////////////////////////////////////////////////////////
            let i=0;
            let data;
            let data1;
            let autoSkip = true;
        async function fetchData(){
            const response = await fetch(`/api/teacher/getGroupe_ens`);//fetch steps.... modal
            const data = await response.json();
            return data;
        }

        function getarray() {
            fetchData()
                .then(arr => {
                data = [...arr];
                data1 = [...arr];
                bb();
                })
            }


            let columns=["niveau", "specialite", "section","groupe", "module", 'id_section', 'id_grp'];
            let columns_Eng=["Level", "Specialty", "Section", "Group", "Module"];
            let answers=[8];
            let select = document.getElementById('selectS');


        function bb(){
            if(i<1)
                document.getElementById('previousbtn').disabled = true;
            if(i<6)
                document.getElementById('next').disabled = true;
            document.getElementById('next')?.classList.add('skipped');
            if (i===4  && answers[3] === 'All groups') {//bach ki ykhyer typre==cours manselectionich groupe
                answers[3]=null;//case ta3 groupe == null
                answers[6]=null;//case ta3 groupe == null
            }


        /* if (answers[4]=='All groups' && i===5){
            // answers[4]=null;//case ta3 groupe == null
                answers[7]=null;//case ta3 id_groupe == null
            }*/


            const container = document.getElementById('selection');//chatgpt
            container.classList.remove('active');//chatgpt
        

            let m =data.map(item => item[columns[i]]);//ncreeyiw tableau fih les column1 ta3 data
            document.getElementById('titre').innerHTML=`${columns_Eng[i]}: `;
            //console.log(data)

            m=[...new Set (m)];
            m = m.filter(item => item !== null);

            //console.log(m)
            if (i === 3 && data1.some(item => item.type === 'LECTURE') && data.some(item => item.section.includes(answers[2])) &&
            data.some(item => item.specialite.includes(answers[1])) && data.some(item => item.niveau.includes(answers[0]))) {
                m.unshift('All groups');
        }
        

            if(m.length===1 && i!=0 && i<4 && autoSkip){

                document.getElementById('selectS').disabled = !!autoSkip;

                if(m[0]=='TC'){
                    answers[i]=null;
                }
                const value = m[0];
                answers[i]=value;
                select.innerHTML='';
                let option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                option.selected = true;
                select.appendChild(option);
                //select.disabled = true;//////////////////////////////////////????????
                select.classList.add('skipped');
                i++
                setTimeout(() => {
                    select.disabled = false;
                    select.innerHTML = '';
                    bb();
                }, 500); //////hadi bach tafficher
        
                return;
            }

            select.innerHTML = '';//chatgpt
            select.classList.remove('visible');//chatgpt
            document.getElementById('selectS').classList.remove('skipped');


            let def = document.createElement('option');//option par defaut
                def.textContent=`Select a ${columns_Eng[i]}`;
                def.disabled=true;
                def.selected=true;
                select.appendChild(def);

            (m.slice(0, 5)).forEach(value=> {//kol option fl m
                    let option = document.createElement('option');
                    option.value=value;
                    option.textContent = value//.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                    select.appendChild(option);//creation select
                });


                setTimeout(() => {//chatgpt
                    select.classList.add('visible');
                }, 50);////////////////////////////////////////////hadi bach tcreer mlwl


                setTimeout(() => {
                    select.classList.add('visible');
                    styleSelect(); // apply custom style
                }, 50);
                
                
        }
        function aa(){// function on change
                let a = event.target.value;//selected
                if(a!='All groups'){
                    data=data.filter(option=>option[columns[i]] == a);//tsupprimer fl array data
                }

                if(i===4){//ida type ykon td wla tp ... hna njozo 3la i==5
                    answers[6]=data[0][columns[7]];//n7to id_groupe f answers[7]              
                    document.getElementById('next').disabled = false;
                }

                if( i<4){
                    answers[i]=a;
                    select.innerHTML='';
                    document.getElementById('previousbtn').classList.remove('skipped');
                    document.getElementById('previousbtn').disabled = false;

                    i++;
                        /*if (i===4  && answers[3] === 'LECTURE') {//bach ki ykhyer typre==cours manselectionich groupe
                            answers[i]=null;//case ta3 groupe == null
                            answers[7]=null;
                            i++;//nsotiw groupe mandiroch les options ...
                        }else */
                bb();        
                }else{          //hna yb3tek bach t3mr l form
                    answers[i]=a;
                    //document.getElementById('next').style.display='block'
                    document.getElementById('next').classList.remove('skipped');

                    answers[5]=data[0][columns[5]];//n7to id_section f answers[5] fi kol 7ala 
                    answers[6]=data[0][columns[6]];//n7to id_groupe f answers[6] fi kol 7ala 
                    //console.log(answers)

                }
        }

        document.getElementById('previousbtn').onclick = () => {       //onclick previous
            autoSkip=false;
            data = [...data1];
            answers.pop();              
            i--;
            /*if (columns_Eng[i]=='Group' && answers[i] !== 'All groups') {
                //document.getElementById('previousbtn').click();//ida l user khyer cours maykhyrch ama groupe m3neteha nrj3o 2 fois
                //bb();
            //return;
            answers[i] = null;
            answers[6] = null;
            i--; 
            }*/

            for(let j=0;j<i;j++){
                data=data.filter(n=>n[columns[j]] == answers[j]);//mor ma l user dar previous n3awdo njibo l array lwlaa w nsupprimiw 3la 7ssab tablea answers
            }
            select.innerHTML='';
            if(i<1){
            //document.getElementById('previousbtn').style.display='block';
            document.getElementById('previousbtn').classList.add('skipped');}

            if(i<5){
            //document.getElementById('next').style.display='none';
            document.getElementById('next').classList.remove('skipped');
            document.getElementById('next').disabled = false;
            }
            document.getElementById('selectS').classList.remove('skipped');


            bb();
        }

        document.getElementById('next').onclick = () => {//tb3t ll form ta3 sondage
            resetSelectStyles()
            document.getElementById('selection').style.display='none';         
            document.getElementById('form').style.display='block';
            resetSelectStyles()
            document.getElementById("retour").style.display='block'

        }

        function resetModal() {
            data = [];
            data1 = [];
            i = 0;
            autoSkip=true;
            answers = [7];
            document.getElementById('selectS').innerHTML = '';
            document.querySelectorAll("input").forEach(inp => inp.value = ''); //ga3 les input





            const options = document.querySelectorAll('.option');
            if (options.length > 2) {
                options.forEach((option, index) => {
                    if (index >= 2) option.remove();
                });
            }
            x = 2;
        
        if (!document.getElementById('ajouter')) {
            const addButton = document.createElement('button');
            addButton.id = 'ajouter';
            addButton.innerHTML = `
                <span class="ajouter-btn">+</span>
                ajouter une option
            `;
            addButton.onclick = ajouter;
            document.getElementById('submitBtn').insertAdjacentElement('beforebegin', addButton);
        }



            document.getElementById('previousbtn').disabled = true;
            //document.getElementById('previousbtn').classList.add('skipped');
            //document.getElementById('next').style.display = 'none';
            document.getElementById('next').disabled = true;
            getarray();
            document.getElementById('form').style.display = 'none';
            document.getElementById('selection').style.display = 'block';
            document.getElementById('retour').style.display='none';
            document.getElementById('submitBtn').textContent='creer un sonadge';
        }



            /*select.addEventListener('focus', () => arrow.classList.add('rotated'));
            select.addEventListener('blur', () => arrow.classList.remove('rotated'));
            select.addEventListener('change', () => arrow.classList?.remove('rotated'));*/





        //  |-----------------------------------------------------------------------------|
        //  |niveau | specialite | section | type | groupe | module | id_section | id_grp |
        //  |-----------------------------------------------------------------------------|
    //////////////////////////////////////////////////////////////////fin get select////////////////////////////////////////////////////////////////////
            async function creerSondage(opt){
                //console.log(opt)
                let res
                try{
                    if(document.getElementById('submitBtn').textContent=='creer un sonadge'){
                        res =await fetch("/api/teacher/creerSondage",
                        {
                            method:'POST',
                            headers:{ 'Content-Type' :'application/json'},
                            body:JSON.stringify(opt)

                        });

                    }else{
                        res =await fetch("/api/updateSondage",
                        {
                            method:'POST',
                            headers:{ 'Content-Type' :'application/json'},
                            body:JSON.stringify(opt)
                        });
                    }
                    const response= await res.json();
                            if(!res.ok){
                                err(response.message,'rgba(255, 0, 0, 0.8)')
                            }else{
                                err(response.message,'green');
                                resetModal();
                                modal.style.display = "none";
                                afficherSondage();
                            }

                }catch(error){
                    console.error("Erreur lort de la création du sondage",error);
                }
            }

            function err(message, clr){
                const msg = document.getElementById("errMsg");
                msg.innerHTML=message;
                msg.style.display = "block";
                msg.style.backgroundColor= clr;
                setTimeout(() => {
                    msg.style.display = "none";
                }, 3000);
            }

                function creerPoll() {
                    let opt = [];
                    opt[0] = (answers[4] || data[0].module || '').toString().trim();
                    opt[1] = null; 
                    opt[2] = (answers[5] || data[0].id_section || '').toString().trim();
                    opt[3] = (answers[6] || data[0].id_groupe    || null);
                    opt[4] = (document.getElementById('qst').value).toString().trim();
                    
                    const ansInputs = Array.from(document.querySelectorAll('.answer'));
                    const validAnswers = ansInputs.map(input => (input.value || '').toString().trim()).filter(answer => answer !== '');
                    
                    opt = [...opt, ...validAnswers];
                    //const pollId=data[0].id
                    opt[9]=PollId;
                    //console.log(PollId)
                    
                    if (!opt[4]) {
                    err("Veuillez entrer un titre valide", "rgba(255, 0, 0, 0.8)");
                    return;
                    }
                    
                    if (validAnswers.length < 2) {
                    err("Minimum 2 options requises", "rgba(255, 0, 0, 0.8)");
                    return;
                    }

                    creerSondage(opt);
                }
        /////////////////////////////////////////////////////////////////////////////fin creation sondage/////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////start affichage sondage/////////////////////////////////////////////////////////////////////////////
    let ddata
    async function afficherSondage() {
        try {
            const container = document.getElementById("container");
            container.innerHTML = '';
            container.style.display = "grid"; 
            container.style.removeProperty("height");

            const response = await fetch(`/api/teacher/getSondage_ens/`);
            const data = await response.json();
            ddata=data
        
            if (data.length === 0) {
                first=document.createElement("div");
                first.id='first';
                first.innerHTML=`<div class=ffirst>No schedules have been created yet</div><div id='creerF'>Create a Poll</div>`;
                container.appendChild(first);
                document.getElementById("creerF").onclick = function() {
                    modal.style.display = "block";
                }
                btn.style.display = "none";
                container.style.display = "flex"; 
                container.style.height = "80vh";
                return;
            }
            btn.style.display = "block";

            for (const sn of data) {
                const creationTime = new Date(sn.temps_creation).getTime();
                const timeCreation = (Date.now() - creationTime) / (1000 * 60 * 60);
                console.log(creationTime)
                console.log(timeCreation)
    
      
                let timetext;
                let Ended=false ;
                if (timeCreation >= 730) 
                    continue;
                else if( timeCreation > 96) {
                    timetext = `Poll ended ${Math.floor(( timeCreation - 72) / 24)} days ago`;
                    Ended=true;
                }else if( timeCreation > 72) {
                    timetext = `Poll ended ${Math.floor(timeCreation - 72)} hours ago`;
                    Ended=true;
                }else{
                    const hoursLeft = 72 -  timeCreation;
                    if (Math.floor(hoursLeft / 24) > 0) {
                        timetext = `Poll ends in ${Math.floor(hoursLeft / 24)} day${Math.floor(hoursLeft / 24) > 1 ? 's' : ''}`;
                    } else {
                        timetext = `Poll ends in ${Math.floor(hoursLeft)} hours`;
                    }
                }
        
                const pollData = createPollData(sn, Ended);
                const pollDiv = createPollElement(sn, timetext, Ended);
                answer(pollDiv, pollData);
                container.appendChild(pollDiv);
                showResults(pollDiv, pollData);
            }
        } catch (error) {
            document.getElementById("container").innerHTML = '<h4>Erreur----------------- connection</h4>';
        }
    }
        
    function createPollData(sn, Ended) {
        const data = {
            answers: [sn.option_1, sn.option_2],
            answerweight: [sn.nbr_1, sn.nbr_2],
            pollcount: sn.nbr_1 + sn.nbr_2,
            Ended: Ended
        };
        
        if (sn.option_4) {
            data.answers.push(sn.option_3, sn.option_4);
            data.answerweight.push(sn.nbr_3, sn.nbr_4);
            data.pollcount += sn.nbr_3 + sn.nbr_4;
        } else if (sn.option_3) {
            data.answers.push(sn.option_3);
            data.answerweight.push(sn.nbr_3);
            data.pollcount += sn.nbr_3;
        }
        if(sn.nbr_1+sn.nbr_2+sn.nbr_3+sn.nbr_4>1)
            data.selectedAnswer = data.answerweight.indexOf(Math.max(...data.answerweight));//max vote
        
        return data;
    }  

    function createPollElement(sn, timetext, Ended) {
        const pollDiv = document.createElement('div');
        pollDiv.className = "poll";
        pollDiv.dataset.id = sn.id;      
        pollDiv.innerHTML = `
            <div class="module">${sn.module} </div>
                <div class="confirmation-modal" style="display: none;">
                    <p id="confirmation-text">Are you sure you want to delete this Poll?</p>
                        <div class="modal-buttons">
                            <button class="Oui">Yes</button>
                            <button class="Non">No</button>
                        </div>
                </div>
                <div class="m">
                    <div class="question" >${sn.titre}</div>
                    <div class="answers"></div>
                    <div class="buttom">
                        <div class=" Nssg">
                            <div class="ns">
                                <div class="niveau">Niveau: <span class='sn'>${sn.niveau}</span>&nbsp&nbsp</div><div class="specialite">Specialite: <span class='sn'>${sn.specialite}</span></div>
                            </div>
                            <div class="ns">
                            ${sn.section !== 'G' ? `<div class="section">Section: <span class='sn'>${sn.section}</span>&nbsp&nbsp</div>` : ''}
                            ${sn.groupe !== null ? `<div class="groupe">Groupe: <span class='sn'>${sn.groupe}</span></div>` : ''}
                            </div>
                        </div>
                        <div class='tv'>
                            <div class="time ${Ended ? 'ended' : ''}"><span class='sn'>${timetext}</span> </div>
                            <div class="nVote"><span class='sn'>${sn.nbr_1+sn.nbr_2+sn.nbr_3+sn.nbr_4}</span> personne voted </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

            return pollDiv;
    }

    function answer(pollDiv, pollData) {
        const answersContainer = pollDiv.querySelector('.answers');
        answersContainer.innerHTML = '';
        try{
            pollData.answers.forEach((answer, i) => {
                const answerDiv = document.createElement('div');
                const percentage = pollData.pollcount > 0 ? Math.round((pollData.answerweight[i] / pollData.pollcount) * 100): 0;
                answerDiv.className = `answer ${pollData.selectedAnswer === i ? 'selected' : ''}`;;
                answerDiv.innerHTML = `
                    <div class="answer-container">
                        <div class="percentage-bar" style="width: ${pollData.Ended ? percentage : 0}%"></div>
                        <div class="answer-content">
                            <span class="answer-text">${answer}</span>
                            <span class="percentage-value">${pollData.Ended ? `${percentage}%` : ''}</span>
                        </div>
                    </div>
                `;
                answersContainer.appendChild(answerDiv);
            });   
        }catch(error){
            console.error('probleme fr each'+error)
        }
    }
        
    function showResults(pollDiv, pollData) {
        const answerElements = pollDiv.querySelectorAll('.answer');
        let maxPercentage = 0;
        let percentages = [];

        answerElements.forEach((element, i) => {
            const percentage = pollData.pollcount > 0 
                ? Math.round((pollData.answerweight[i] / pollData.pollcount) * 100)
                : 0;
            percentages.push(percentage);
            if (percentage > maxPercentage) maxPercentage = percentage;
        });

        answerElements.forEach((element, i) => {
            const percentage = percentages[i];
            const bar = element.querySelector('.percentage-bar');
            const value = element.querySelector('.percentage-value');

            bar.style.width = `${percentage}%`;
            value.textContent = `${percentage}%`;

            if (pollData.Ended) {
                element.classList.remove('selected');
                if (percentage === maxPercentage && maxPercentage > 0) {
                    element.classList.add('result');
                }
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let PollId = null;
    let confirmer;
    let confirmOpen = false;

    document.addEventListener("DOMContentLoaded", () => {
        const container = document.getElementById("container");
        const menu = document.getElementById("menu");
        const edit=document.querySelector('.menu-item')


        container.addEventListener("contextmenu", (e) => {
            if (confirmOpen) {
                e.preventDefault();
                return;
              }
            edit.style.pointerEvents = "";
            edit.style.opacity = "";
            const pollElement = e.target.closest(".poll");
            confirmer = pollElement.querySelector('.confirmation-modal');
            const nV = pollElement.querySelector('.nVote .sn').textContent;//nVotes number lazem tkon <0
            const ended = (pollElement.querySelector('.time .sn').textContent).slice(0,9)=='Poll ends';//lpoll mazal 
            if (!pollElement) return;
            if(!ended || nV>0){
                edit.style.pointerEvents = "none";
                edit.style.opacity = "0.4";
            }
            e.preventDefault();
            PollId = pollElement.getAttribute("data-id");
            
            menu.style.left = `${e.clientX}px`;
            menu.style.top = `${e.clientY}px`;
            menu.style.display = "block";
            
            const hideMenu = () => {
                menu.style.display = "none";
                document.removeEventListener("click", hideMenu);
            };
            setTimeout(() => document.addEventListener("click", hideMenu), 0);
        });

        menu.addEventListener("click", (e) => {
            const menuItem = e.target.closest(".menu-item");
            if (!menuItem || !PollId) return;
            
            menu.style.display = "none";
            
            if (menuItem.textContent.trim() === "Delete") {
              //  confirmer.style.left = `${parseInt(menu.style.left) - 100}px`;
                //confirmer.style.top = `${parseInt(menu.style.top) - 50}px`;
                document.querySelectorAll('.confirmation-modal').forEach(m => m.style.display = 'none');
                confirmer.style.display = "block";
                confirmOpen = true;


                const yes = confirmer.querySelector('.Oui');
                const no  = confirmer.querySelector('.Non');
                yes.onclick = () => {
                    confirmer.style.display = "none";
                    deleteS(PollId);
                    confirmOpen = false;
                };
                    
                no.onclick = () => {
                    confirmer.style.display = "none";
                    confirmOpen = false;
                };
            } else {
                //console.log(PollId)
                editS(PollId);
            }
        });
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function deleteS(id){
        const resp=await fetch("/api/deleteSondage",
            {
                    method:'POST',
                    headers:{ 'Content-Type' :'application/json'},
                    body: JSON.stringify({id})
                })
            const res= await resp.json();
                if(!resp.ok){
                    err(res.message,'rgba(255, 0, 0, 0.8)')
                }else{
                    //afficherSondage(id_enseignant);
                    err(res.message,'green');
                    resetModal();
                    afficherSondage();
                }

    }

    async function editS(id){
        data = ddata.filter(el => el.id == id);
        resetSelectStyles()
        document.getElementById('retour').style.display='block';
        let btn=document.getElementById("retour")
        btn.style.display='block';
        btn.onclick=function(){
            document.getElementById('selection').style.display='block';         
            document.getElementById('form').style.display='none'; 
            document.getElementById('selectS').innerHTML='';
            //document.getElementById('selectS').onchange=' ';
            document.getElementById('selectS').setAttribute('onchange', 'aa(false)');
            getarray()//creer sondage jdid
            document.getElementById('retour').style.display='none';
            autoSkip=false
        }
        document.getElementById('submitBtn').textContent='UPDATE SONDAGE'


        document.getElementById('form').style.display='none'; 
        modal.style.display = "block";
        document.getElementById('selection').style.display='none';         
        document.getElementById('form').style.display='block'; 
        document.getElementById('qst').value=data[0].titre;
        if(data[0].option_4!==null){
            ajouter();//ndiroha 2 fois katch kayen 2 input edit 
            ajouter();       
            document.querySelectorAll(".answer")[3].value=data[0].option_4;
            document.querySelectorAll(".answer")[2].value=data[0].option_3;  
        }else if(data[0].option_3!==null){
            ajouter();
            document.querySelectorAll(".answer")[2].value=data[0].option_3;
        }
        document.querySelectorAll(".answer")[0].value=data[0].option_1;// dayemen kayen minimum 2 imputs
        document.querySelectorAll(".answer")[1].value=data[0].option_2;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    window.addEventListener('scroll', function() {
        document.getElementById('menu').style.display = 'none';
    });

        // Exemple
        afficherSondage();
        getarray() 

            function styleSelect() {
                let modal=document.querySelector('.modal-content')
                if (window.innerWidth <= 1536) {
                    modal.style.width = '40%';
                    modal.style.height = '17em';
                } else if (window.innerWidth <= 1707) {
                    modal.style.width = '35%';
                    modal.style.height = '18em';
                } else {
                    modal.style.width = '30%';
                    modal.style.height = '18em';
                }
                modal.style.marginTop='15vh'
                document.getElementById('selection').style.marginTop='5px'
                document.querySelector('.titre').style.height= '6vh';

                
                
                const select = document.getElementById('selectS');
                select.style.padding = '10px';
                //select.style.border = '2px solid #3498db';
                select.style.borderRadius = '8px';
                select.style.fontSize = '16px';
                select.style.backgroundColor = '#f0f8ff';
                select.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                select.style.transition = 'all 0.3s ease';
                select.style.outline = 'none';
                select.style.cursor = 'pointer';
            }
            function resetSelectStyles() {
                let modal = document.querySelector('.modal-content');
                modal.style.height = '';
                modal.style.width = '';
                modal.style.marginTop = '';
                document.querySelector('.titre').style.height= '';

            
                const selection = document.getElementById('selection');
                if (selection) selection.style.marginTop = '';
            
                const select = document.getElementById('selectS');
                if (select) {
                    select.style.padding = '';
                    select.style.borderRadius = '';
                    select.style.fontSize = '';
                    select.style.backgroundColor = '';
                    select.style.boxShadow = '';
                    select.style.transition = '';
                    select.style.outline = '';
                    select.style.cursor = '';
                }
            }
            


        const arrow = document.querySelector('.custom-arrow');
        
        select.addEventListener('mousedown', () => {
            if (arrow.classList.contains('rotated')) {
                arrow.classList.remove('rotated');
            } else {
                arrow.classList.add('rotated');
            }
        });
        
        select.addEventListener('blur', () => {
            arrow.classList.remove('rotated');
        });
        

        document.getElementById("retour").onclick=function(){
            styleSelect()
            document.getElementById('selection').style.display='block';         
            document.getElementById('form').style.display='none'; 
            document.getElementById('retour').style.display='none';
        }