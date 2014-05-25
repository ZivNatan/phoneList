var validator = {
    isUserNameValid: function() {
        
        var userName = $("#username").val(),
            isValid;

        if (userName.length <= 2) {
            isValid = false;
            alert("Username to short");
        } else {
            isValid = true;
        }

        return isValid;
    },
  
    isEmailValid: function() {
       var email = $("#email").val(); 
       
       if (email.length<4){
            isValid=false;
            alert("Email is not valid");
       } else {
            isValid=true;
       }

       return isValid;
    },
    isPasswordValid: function() {
        var password = $("#password").val(),
            passwordConfirm = $("#password-confirm").val(),
            isValid;

        if (password != passwordConfirm || password.length <= 5) {
            isValid = false;
             alert("Password do not match or to short");
        } else {
            isValid = true;
            
        }

        return isValid;
    },
    isFormValid: function() {
        
        var a = this.isUserNameValid();
        var b = this.isEmailValid() ;
        var c = this.isPasswordValid();

        return a && b && c;

    }
};



var phoneBook = {
    persons: [],
    uniqueID: 0,  

    addPerson: function(name, phone){
        var person = {};
        person.name = name;
        person.phone = phone;
        person.id = this.uniqueID++;

        this.persons.push(person);
        this.addPersonToList(person);
    },

    addPersonToList: function(person){
        var template = this.getPersonRowTemplate(person);
        $('#list').append(template);
        $('#person-name').val('');
        $('#person-phone').val('');
        phoneBook.saveList();
    },

    getPersonRowTemplate: function(person){
        var template ='';
        
        template +='<div id="person-' + person.id +'" class="row">' + 
        '<button class= "delete btn btn-danger btn-mini" onclick="phoneBook.deletePerson(' + person.id +')">' + 'Delete' + '</button>' 
        + '<button class= "edit btn btn-success btn-mini" onclick="phoneBook.editPerson(' + person.id +')">'+ 'Edit' + '</button>' 
        +" " +'<span class="text">'+ person.name +' - ' + person.phone+ '</span>'+'</div>';
        return template;
    },

    editPerson: function(id){

        this.closeEditInputs();
        var $personRow = this.openEditInputs(id);
        var person = phoneBook.getPerson(id);

        $('#edit-input').find('#edit-name').val(person.name).focus();
        $('#edit-input').find('#edit-phone').val(person.phone);
        
        $("#change").click(function(){

            var name = $("#edit-name").val(),
                phone = $("#edit-phone").val();
            
            var person = phoneBook.getPerson(id);
            if(person != null){                
                person.name = name;
                person.phone = phone; 

                $personRow.find(".text").html(person.name + ' - ' + person.phone);
            }
            phoneBook.closeEditInputs();
            
            phoneBook.saveList();
        })

    },

    closeEditInputs: function(){
         $('#list').find(".text").css("background-color","");
        $('#edit-input').remove();
    },

    openEditInputs: function(id){
         var $personRow = $("#person-"+ id);
        $personRow.find(".text").css("background-color","yellow");
        
        $personRow.after(
            '<span id="edit-input">'+'<input id="edit-name" type="text" value="" placeholder="Edit name">'+" "+
            '<input id="edit-phone" type="text" value="" placeholder="Edit phone">' + '<button id="change" class="btn btn-default">' +'change'+'</button>'+'</span>');   
        return  $personRow;
    },

    getPersonIndex: function(id){
        var personIndex = null;
        for(var i=0; i<this.persons.length; i++){
            if(this.persons[i].id == id){
                personIndex = i;
                break;
            }
        }
        return personIndex;
    },

    getPerson: function(id){
        var personIndex = null;
        for(var i=0; i<this.persons.length; i++){
            if(this.persons[i].id == id){                
                return this.persons[i];
            }
        }
        return null;
    },

    deletePerson: function(id){
      
      var personIndex = this.getPersonIndex(id);
       
      if(personIndex != null){
        this.persons.splice(personIndex, 1);
      }

      $('#person-' + id).remove();
      this.saveList();
      
    },    

/*
    "abcd".indexOf('b') == 1
    "abcd".indexOf('bc') == 1
    "abcd".indexOf('a') == 0
    "abcd".indexOf('x') == -1
*/
    searchText: function(text){
        for(var i=0; i<this.persons.length; i++){
            $("#search-box").val("");
            var person = this.persons[i];
            var startIndex = person.name.indexOf(text);
            
            if(startIndex>-1) {
                 
              $('#person-' + person.id).find(".text").html(person.name.replace(text, '<span class="highlight">' + text + '</span>') + ' - ' + person.phone);

              setTimeout(function(){
                $('.highlight').removeClass('highlight');
              }, 5000)

            } 

        }
    },   

  
    saveList: function(){

        var list = JSON.stringify(this.persons);
        
        localStorage.setItem('theList', list);
            
        
    },

    loadList: function(){
        var storageList = localStorage.getItem('theList');
        var list = jQuery.parseJSON( storageList );
        if(list != null){
            this.restorPersonsToList(list);
        }
// todo: run (for loop) on list array, and call method addPerson with list[i].name & list[i].phone 
    },

    restorPersonsToList: function(list){
            for(var i=0; i<list.length;i++){
                this.addPerson(list[i].name,list[i].phone);
            } 
              
     },

       init: function(){
        
        var that = this;

        $('#add-button').click(function(){
          var personName = $('#person-name').val();
          var personPhone = $('#person-phone').val();
          that.addPerson(personName, personPhone);
        });
    },   
};

$(document).ready(function(){
    $("#signup-form").hide(0);

    phoneBook.loadList();
  
    phoneBook.init(); 
   
    
    $('#signup-button').click(function(){

        $("#signup-form").slideDown(1000);
    });

    $('#clear-button').click(function(){

        $("#signup-form").hide(0);
    });

    $('#signup-form').on('submit', function(e){

        var flag = validator.isFormValid();

        return flag;

    });

    $("#search-button").click(function(){
            var text = $("#search-box").val();
            phoneBook.searchText(text);
        })
   
});



