async function Sondage() {
    try {
        const container = document.getElementById("container");
        container.innerHTML = '';
  
        const response = await fetch(`/api/student/getSondage_etud/`);
        const data = await response.json();
        console.log(data)
  
        if (data.length === 0) {
            const first = document.createElement("div");
            first.id = 'empty';
            first.innerHTML = `No Poll have been created yet`;
            container.appendChild(first);
            container.style.display = "flex"; 
            container.style.height = "80vh";
            return;
        }
  
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

            
  
            let existingVote = await Check(sn.id);//nchofo ida vota deja f tableau voters treturner null wla 0 1 2 3 
            existingVote = existingVote !== null ? parseInt(existingVote, 10) : -1;   //ida kan existing vote!= null nrj3oha int ida ==null ndiro class name vote
  
            let poll;
            if (existingVote !== -1) {
                //pollData = createPollData(sn, existingVote); 
                //const pollDiv = createPollElement(sn, timetext, true);
                poll = createPoll(sn, timetext, existingVote, true, Ended);
                answ(poll, sn);
                container.appendChild(poll);
                showResults(poll);
            } else {
                //pollData = createPollData(sn, existingVote); 
                //const pollDiv = createPollElement(sn, timetext, false);
                poll = createPoll(sn, timetext, existingVote, false, Ended);
                answ(poll, sn);
                container.appendChild(poll);
            }
        }
    } catch (error) {
        document.getElementById("container").innerHTML = '<h4>Erreur connection</h4>';
        console.error('Problème dans la fonction Sondage:', error);
    }
  }
    
  
  function createPoll(sn, dateText, selectedAnswer, hasVoted, Ended) {
    const data = {
      answers: [sn.option_1, sn.option_2],
      answerweight: [sn.nbr_1, sn.nbr_2],
      pollcount: sn.nbr_1 + sn.nbr_2,
      selectedAnswer: selectedAnswer,
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
  
  
  
    const poll = document.createElement('div');
    poll.className = `poll ${hasVoted ? 'voted' : ''}`;
    poll.innerHTML = `
        <div class="module">${sn.module}</div>
        <div class="m">
            <div class="confirmation-modal" style="display: none;">
                <p id="confirmation-text"></p>
                <div class="modal-buttons">
                    <button class="Oui">Yes</button>
                    <button class="Non">No</button>
                </div>
            </div>
            <div class="question">${sn.titre}</div>
            <div class="answers">
                <span class="answer-text"></span>
            </div>
            <div class="buttom">
                <div class="poll-info">
                    <span class=".nVotes"><span class="r">${sn.nbr_1+sn.nbr_2+sn.nbr_3+sn.nbr_4}</span> personne voted</span>
                    <span class="time">${dateText}</span>               
                    </div>
                    <div class="lancee">lancée par <span class="r">${sn.prenom_ens.split("")[0].toUpperCase()}.${sn.nom_ens[0].toUpperCase()+sn.nom_ens.slice(1)}</span></div>  

            </div>
        </div>
    `;

    poll.data = data;
    return poll;
  }
  
            function answ(poll, sn) {//7esseb l pourcentage w tafficher tdir tani send vote ida mazal ma votach l user 
                const answersContainer = poll.querySelector('.answers');
                const modal = poll.querySelector('.confirmation-modal');
                const confirmationText = modal.querySelector("#confirmation-text");
                
                answersContainer.innerHTML = '';
            
                poll.data.answers.forEach((answer, i) => {
                    const answerDiv = document.createElement('div');
                    const percentage = poll.data.pollcount > 0 
                        ? Math.round((poll.data.answerweight[i] / poll.data.pollcount) * 100)
                        : 0;
            
                    answerDiv.className = `answer ${poll.data.selectedAnswer === i ? 'selected' : ''}`;
                    answerDiv.innerHTML = `
                        <div class="answer-container">
                            <div class="percentage-bar"></div>
                            <div class="answer-content">
                                <span class="answer-text">${answer}</span>
                                <span class="percentage-value">${poll.data.Ended ? `${percentage}%` : ''}</span>
                            </div>
                        </div>
                    `;
            
                    const bar = answerDiv.querySelector('.percentage-bar');
                    const value = answerDiv.querySelector('.percentage-value');
            
                    bar.style.width = poll.data.Ended ? `${percentage}%` : '0%';
            
                    if (poll.data.selectedAnswer === -1 && !poll.data.Ended) {//hadi event listener bach yvoter ki yclicker
                        answerDiv.addEventListener('click', async () => {
                            if (poll.data.selectedAnswer !== -1) return;
            
                            confirmationText.textContent = `Vote for "${answer}"?`;
                            modal.style.display = "block";
            
                            modal.querySelector(".Non").onclick = () => modal.style.display = "none";
                            modal.querySelector(".Oui").onclick = async () => {
                                modal.style.display = "none";
                                try {
                                    await sendVote(sn.id, i);
                                    const newPoll = createPoll(sn, poll.querySelector('.time').textContent, i, true, poll.data.Ended);
                                    /*answ(newPoll, sn, Email, groupe);
                                    showResults(newPoll);
                                    poll.replaceWith(newPoll);*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // ←— update local data
                                    poll.data.selectedAnswer = i;
                                        poll.querySelectorAll('.answer').forEach((el, idx) => {
                                            el.classList.toggle('selected', idx === i);
                                            });
                                    poll.data.answerweight[i] = (poll.data.answerweight[i] || 0)+1;
                                    poll.data.pollcount++;
                            
                                    // ←— update vote-count display
                                        // just grab the inner <span class="r"> wherever it is
                                        const totalSpan = poll.querySelector('span.r');
                                        if (totalSpan) totalSpan.textContent = poll.data.pollcount;
                            
                                    // ←— redraw bars & percentages
                                    showResults(poll);
                            
                                    // ←— switch to “voted” styling
                                    poll.classList.add('voted');
    

                                } catch (error) {
                                    console.error('Failed to send vote:', error);
                                }
                            };
                        });
                    }
                    
                    answersContainer.appendChild(answerDiv);
                });
            
                if (poll.data.Ended) {
                    showResults(poll);
                }
            }
  

    function showResults(poll) {
        let answerElements = poll.querySelectorAll('.answer');
        let maxPercentage = 0;
        let percentages = [];

        answerElements.forEach((element, i) => {
            let percentage = poll.data.pollcount > 0 
                ? Math.round((poll.data.answerweight[i] / poll.data.pollcount) * 100)
                : 0;
        
            percentages.push(percentage);
            if (percentage > maxPercentage) 
                maxPercentage = percentage;
            });

    answerElements.forEach((element, i) => {
        const percentage = percentages[i];
        const bar = element.querySelector('.percentage-bar');
        const value = element.querySelector('.percentage-value');

        bar.style.width = `${percentage}%`;
        value.textContent = `${percentage}%`;

        element.classList.remove('result');
        if (percentage === maxPercentage && maxPercentage > 0 && poll.data.Ended) {
            element.classList.add('result');
        }

        if(poll.data.Ended){
            element.classList.remove('selected');
            poll.querySelector('.time').classList.add('ended');
        }
    });
}
  
  async function sendVote(pollId, selectedOption) {
    try {
        const response = await fetch("/api/student/participerSondage", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: pollId, option: selectedOption}),
        });
  
        const data = await response.json();
        console.log('Vote result:', data);
        return data;
    } catch (error) {
        console.error('Problem in sendVote:', error);
        throw error; 
    }
  }
  async function Check(pollid) {
    try{
        const resp = await fetch(`/api/student/checkVote/${pollid}`);
        const check = await resp.json();
  
        if (check.choix !== undefined) {
            return check.choix; 
        }
        return null;
                
    } catch (error) {
        console.error('Problem in Check:', error);
        return null;
    }
  }
  
  // Exemple
  Sondage();