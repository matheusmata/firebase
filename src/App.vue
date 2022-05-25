<template>
  <div id="app">

    <div>
      <h1>Cadastrar</h1>

      <label>Nome: </label>
      <input type="text" v-model="nome"/> <br/><br/>
      <label>Email: </label>
      <input type="text" v-model="email"/> <br/><br/>
      <label>Senha: </label>
      <input type="text" v-model="senha"/>

      <br/>
      <button @click="cadastrarUsuario">Cadsatrar</button>
      <button @click="entrar">Logar</button>
    </div>


    <div v-if="user">
      <h2>{{this.user.email}}</h2>
      <h2>{{this.user.nome}}</h2>
    </div>



  </div>
</template>

<script>
import firebase from './services/firebaseConnection';

export default {
  name: 'App',
  data(){
    return{
      nome: '',
      email: '',
      senha: '',
      user: null,
    }
  },
  methods:{

    async cadastrarUsuario(){
     const { user } = await firebase.auth().createUserWithEmailAndPassword(this.email, this.senha)

     await firebase.firestore().collection('users')
     .doc(user.uid)
     .set({
      nome: this.nome  
     })
     .then(()=>{

       this.nome = '';
       this.email = '';
       this.senha = '';

     })
     .catch((error)=> {
       console.log(error);
     })

    },

    async entrar(){
     const { user } =  await firebase.auth().signInWithEmailAndPassword(this.email, this.senha)

     await firebase.firestore().collection('users')
     .doc(user.uid)
     .get()
     .then((snapshot)=>{
       this.user = { 
         nome: snapshot.data().nome,
         email: user.email
       };
     })

     this.email = '';
     this.senha = '';

    }


  }
}
</script>

<style scoped>

</style>