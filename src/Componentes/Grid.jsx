import React, { useState, useEffect } from 'react';
import '../App.css';
import MaterialTable from "material-table";
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Swal from 'sweetalert2'

const columns= [
    { title: 'Id de Usuario', field: 'userId',  headerAlign: 'center'  },
    { title: 'Id', field: 'id',  headerAlign: 'center' },
    { title: 'Titulo', field: 'title',  headerAlign: 'center'},
    { title: 'Cuerpo', field: 'body',  headerAlign: 'center'},
  ];

const baseUrl="https://jsonplaceholder.typicode.com/";


const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function Grid() {
  const styles= useStyles();

  const [data, setData]= useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [postSeleccionado, setPostSeleccionado]=useState({
    userId: "",
    id: "",
    title: "",
    body: ""
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setPostSeleccionado(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  const peticionGet=async()=>{
    await axios.get(`${baseUrl}posts`)
    .then(response=>{
     setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    await axios.post(`${baseUrl}posts`, postSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      Swal.fire(
        'Creado!',
        'Usted ha creado un post con exito!',
        'success'
      )
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    await axios.put(`${baseUrl}posts/${postSeleccionado.id}`, postSeleccionado)
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(post=>{
        if(post.id===postSeleccionado.id){
          post.userId=postSeleccionado.userId;
          post.title=postSeleccionado.title;
          post.body=postSeleccionado.body;
          post.id=postSeleccionado.id;
        }
      });
      setData(dataNueva);
      Swal.fire(
        'Editado!',
        'Usted ha editado un post con exito!',
        'success'
      )
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(`${baseUrl}posts/${postSeleccionado.id}`)
    .then(response=>{
      setData(data.filter(post=>post.id!==postSeleccionado.id));
      abrirCerrarModalEliminar();
      Swal.fire(
        'Eliminado!',
        'Usted ha eliminado un post con exito!',
        'success'
      )
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarPost=(post, caso)=>{
    setPostSeleccionado(post);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }

  const abrirCerrarModalInsertar=()=>{
    setPostSeleccionado([]);
    setModalInsertar(!modalInsertar);
  }

  
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  useEffect(()=>{
    peticionGet();
  }, [])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo Post</h3>
      <TextField className={styles.inputMaterial} label="Id de usuario" name="userId" onChange={handleChange}/>
      <br />
      <TextField className={styles.inputMaterial} label="Titulo" name="title" onChange={handleChange}/>          
<br />
<TextField className={styles.inputMaterial} label="Cuerpo" name="body" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Post</h3>
      <TextField className={styles.inputMaterial} label="Id de usuario" name="userId" onChange={handleChange} value={postSeleccionado&&postSeleccionado.userId}/>
      <br />
      <TextField className={styles.inputMaterial} label="Titulo" name="title" onChange={handleChange} value={postSeleccionado&&postSeleccionado.title}/>          
<br />
<TextField className={styles.inputMaterial} label="Cuerpo" name="body" onChange={handleChange} value={postSeleccionado&&postSeleccionado.body}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar al post <b>{postSeleccionado && postSeleccionado.id}</b>? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()}>Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )

  return (
    <div className="App">
      <br />
      <Button variant="contained" onClick={()=>abrirCerrarModalInsertar()}>Insertar Post</Button>
      <br /><br />
     <MaterialTable
          columns={columns}
          data={data}
          title="Listado de Posts"
          actions={[
            {
              icon: 'edit',
              tooltip: 'Editar Post',
              onClick: (event, rowData) => seleccionarPost(rowData, "Editar")
            },
            {
              icon: 'delete',
              tooltip: 'Eliminar Post',
              onClick: (event, rowData) => seleccionarPost(rowData, "Eliminar")
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            headerStyle: {
              backgroundColor: '#3f51b5',
              color: '#FFF'
            }
          }}
          localization={{
            header:{
              actions: "Acciones"
            }
          }}
        />


        <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
          {bodyInsertar}
        </Modal>

        
        <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
          {bodyEditar}
        </Modal>

        <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
          {bodyEliminar}
        </Modal>
    </div>
  );
}

export default Grid;
