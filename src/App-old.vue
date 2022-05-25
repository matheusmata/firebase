<template>
  <div id="app">
    <h1>Aprendendo Vuejs + firebase</h1>

    <div v-if="!user">
      <h1>Entrar</h1>
      <label>Email: </label>
      <input type="text" v-model="email"><br/><br/>
      <label>Senha: </label>
      <input type="text" v-model="senha">
      <br/><br/>
      <button @click="entrar">Entrar</button><br/>
      <button @click="cadastrarUsuario">Cadastrar usuário</button><br/>
    </div>
    <div v-else>
      <h1>Você está logado</h1>
      <h2>Email: {{this.email}}</h2>

      <button @click="sair">Sair</button>
    </div>

    <hr/>
    <h1>Cadastrar Post</h1>
    <label>ID:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> <input type="text" v-model="idPost"/><br/><br/>

    <label>Tarefa:</label> <input type="text" v-model="tarefa"/><br/><br/>

    <label>Autor:&nbsp;</label> <input type="text" v-model="autor"/><br/>
<br/>
    <button @click="cadastrar">Cadastrar</button>&nbsp;&nbsp;
    <button @click="buscarPosts">Busca Posts</button>&nbsp;&nbsp;
    <button @click="atualizaPost">Atualizar Posts</button>
    

    <hr/>

    <ul>
      <li v-for="post in posts" :key="post.id">
        <br/> 
        ID: {{post.id}} <button @click="excluirPost(post.id)">Excluir Posts</button><br/>
        Tarefa: {{post.tarefa}}<br/>
        Autor: {{post.autor}}
        <br/>
      </li>
    </ul>

  </div>
</template>

<script>
import firebase from './services/firebaseConnection';
export default {
  name: 'App',
  data(){
    return{
      idPost: '',
      tarefa: '',
      autor: '',
      posts:[],
      email: '',
      senha: '',
      user: false,
    }
  },
  async created(){

    await firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        this.user = true;
       this.email = user.email; 
      }else{
        this.user = false;
        this.email = '';
      }
    })


    await firebase.firestore().collection('posts')
    .onSnapshot((doc)=>{
      this.posts =[];

      doc.forEach((item)=>{
        this.posts.push({
        id:item.id,
        tarefa:item.data().tarefa,
        autor:item.data().autor,
      });
      
      });
    })
  },
  methods:{
    async cadastrar(){
      await firebase.firestore().collection('posts')
      .add({
        tarefa: this.tarefa,
        autor: this.autor
      })
      .then(()=>{
        this.autor = '';
        this.tarefa = '';
        console.log('Cadastrado com sucesso');
      })
      .catch((error)=>{
        console.log('Gerou algum erro' + error);
      })
    },
    async buscarPosts(){
      this.posts = [];
      //await firebase.firestore().collection('posts')
      //.doc('123')
      //.get()
      //.then((snapshot)=>{
      //  this.tarefa = snapshot.data().tarefa;
      //  this.autor = snapshot.data().autor;
      //})
      //.catch((error)=>{
      //  console.log('Error ao buscar'+ error);
      //})
      await firebase.firestore().collection('posts')
      .get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.posts.push({
            id:doc.id,
            tarefa: doc.data().tarefa,
            autor: doc.data().autor,
          });
        })
      })
      .catch((error)=>{
        console.log('Error ao buscar' + error)
      })
  },
  async atualizaPost(){
    await firebase.firestore().collection('posts').doc(this.idPost)
    .update({
      tarefa: this.tarefa,
      autor: this.autor
    })
    .then(()=>{
      console.log('atualizando com sucesso');
      this.autor = '';
      this.tarefa = '';
      this.idPost = '';
    })
    .catch((error)=>{
      console.log('errro ap editar' + error);
    })
  },
  async excluirPost(id){

    await firebase.firestore().collection('posts').doc(id)
    .delete()
    .then(()=>{
      console.log('post excluido ')
    })
  },
  async cadastrarUsuario(){
    await firebase.auth().createUserWithEmailAndPassword(this.email,this.senha)
    .then(()=>{
      this.email = '';
      this.senha = '';
    })
    .catch((error)=>{
      if(error.code === 'auth/weak-password'){
        alert('Senha muito fraca');
      }else if(error.code === 'auth/email-already-in-use'){
        alert('Email já existe');
      }
    })

  },
  async sair(){
    await firebase.auth().signOut();
  },
  async entrar(){
    await firebase.auth().signInWithEmailAndPassword(this.email,this.senha)
    .then((response)=>{
      console.log(response);
    })
    .catch((error)=>{
      console.log(error);
    })
  }
 }
}
</script>

<style scoped>

</style>