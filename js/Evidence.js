class Evidence {

  constructor(){
    const zaznamyLocal = localStorage.getItem("klic");
    this.zaznamy = zaznamyLocal ? JSON.parse(zaznamyLocal) : [];
    // Vstupy instance pojistenec
    this.jmenoInput = document.getElementById("jmenoPojistence");
    this.prijmeniInput = document.getElementById("prijmeniPojistence");
    this.rokInput = document.getElementById("narozeni");            
    this.rodneInput = document.getElementById("rd");
    //Tabulka
    this.tabulka = document.getElementById("tabulka");

    this.celkemZaznamu = document.getElementById("celkem");
    this.ulozenoRadek = document.getElementById("ulozeno");
    this.ulozitButton = document.getElementById("ulozit");

    this.formularNovy = document.getElementById("novyPojistenec");
    this.smazatData = document.getElementById("smaz");
    this.nactiCvicnouDtb = document.getElementById("nacti");
    this.mazatRadek = document.getElementsByClassName("mazaci");
    this.editovatRadek = document.getElementsByClassName("editovaci");

    this.openModalButton = document.getElementById("openModal");
    this.modal = document.getElementById("myModal");
    this.closeModal = document.getElementsByClassName("close")[0];

    this.delayUlozeno = 500;

    this.vypisPojistence();
    this.novyPojistenec();
    this.smazatVse();
    this.nactiCvicnou();
    this.smazRadek();
    this.editujRadek();    
  }

  novyPojistenec(){      
    this.openModalButton.addEventListener("click", () => {
      //vycisteni hodnot ve formulari modalniho okna
      this.jmenoInput.value = "";
      this.prijmeniInput.value = "";
      this.rokInput.value = "";            
      this.rodneInput.value = "";
      //otevreni modalniho okna
      this.modalOkno();
       
      this.formularNovy.addEventListener("submit",  (e) => {
        e.preventDefault();
        this.ulozenoZobraz();
        setTimeout(() => {
          this.formularNovy.submit();
        }, this.delayUlozeno);
        this.zapsatNoveho();          
      }); 
    });   
  }

  zapsatNoveho(){
      let pojistenec = new Pojistenec(
        this.jmenoInput.value,
        this.prijmeniInput.value, 
        this.rokInput.value,
        this.rodneInput.value
      );
      this.zaznamy.push(pojistenec);
      localStorage.setItem("klic", JSON.stringify(this.zaznamy));
      this.vypisPojistence();           
  }

  vypisPojistence() {
    this.tabulka.innerHTML = [];
    this.zaznamy.forEach(item => {
      const newRadek = this.tabulka.appendChild(document.createElement("tr"));
      for (const polozka in item){
        const newPolozka = document.createElement("td");
        newPolozka.innerHTML = item[polozka];
        newRadek.appendChild(newPolozka);
      }
      /*   pridat tlacitka    */
      const tlacitka = document.createElement("td");
      tlacitka.innerHTML = "<button type='button' class='editovaci'>Editovat</button> <button type='button' class='mazaci'>X</button>";
      newRadek.appendChild(tlacitka);
    });
    this.celkemZaznamu.innerText = `Pojistencu v databazi: ${this.zaznamy.length}`;
  }
  
  smazatVse() {
    this.smazatData.addEventListener("click", () => {
      if (window.confirm("Opravdu chcete nenávratně smazat celou databázi?")){
        this.zaznamy = [];
        localStorage.setItem("klic", JSON.stringify(this.zaznamy));
        this.vypisPojistence();
      }
    });
  }
  
  nactiCvicnou() {
    this.nactiCvicnouDtb.addEventListener("click", () => {
      if (window.confirm("Opravdu chcete nacist cvicnout databazi? Prepisou se puvodni data")){
        this.zaznamy = cvicna;
        localStorage.setItem("klic", JSON.stringify(this.zaznamy));
        this.vypisPojistence();
        location.reload();
      }
    });    
  }

  smazRadek(){
    for (let i = 0; i < this.mazatRadek.length; i++){
      this.mazatRadek[i].addEventListener("click", (event) => {
        const radek = event.target.closest("tr");
        if (radek) {
          if (window.confirm("Opravdu chcete smazat tento zaznam?")){
            this.zaznamy.splice(i, 1);
            localStorage.setItem("klic", JSON.stringify(this.zaznamy));
            this.vypisPojistence();
            location.reload();
          }  
        }
      });
    }
  }

  editujRadek(){
    for (let i = 0; i < this.editovatRadek.length; i++){
      this.editovatRadek[i].onclick = (event) => {
        const radek = event.target.closest("tr");
        if (radek) {
          this.jmenoInput.value = this.zaznamy[i].jmeno;
          this.prijmeniInput.value = this.zaznamy[i].prijmeni; 
          this.rokInput.value = this.zaznamy[i].rokNarozeni;
          this.rodneInput.value = this.zaznamy[i].rodneCislo;
          
          this.modalOkno();
          this.formularNovy.addEventListener("submit",  (e) => {
            e.preventDefault();
            this.ulozenoZobraz();
            setTimeout(() => {
              this.formularNovy.submit();
            }, this.delayUlozeno);
          this.zaznamy[i].jmeno = this.jmenoInput.value;
          this.zaznamy[i].prijmeni = this.prijmeniInput.value;
          this.zaznamy[i].rokNarozeni = this.rokInput.value;
          this.zaznamy[i].rodneCislo = this.rodneInput.value;
          localStorage.setItem("klic", JSON.stringify(this.zaznamy));
          this.vypisPojistence();       
          });
        }
      };
    }
  }

  modalOkno(){
    this.modal.style.display = "block";    
    // Zavření modálního okna po kliknutí na ikonu X
    this.closeModal.addEventListener("click", () => {
      this.modal.style.display = "none";
      location.reload();
    });    
    // Zavření modálního okna po kliknutí mimo něj
    window.addEventListener("click", (event) => {
      if (event.target == this.modal) {
        this.modal.style.display = "none";
        location.reload();
      }
    });
  }

  ulozenoZobraz(){         
        this.ulozenoRadek.innerText = "Uloženo";
        this.ulozenoRadek.style.background = "#18cf18";
  }

} //konec class Evidence


