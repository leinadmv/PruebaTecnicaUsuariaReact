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
    width: 800,
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

   /**
   * @author Daniel Martinez
   * @fecha 12/05/2022
   * Servicio get que se encarga de obtener toda la informacion de los posts
   * @returns listado de post en un arreglo de json
   */
  const peticionGet=async()=>{
    await axios.get(`${baseUrl}posts`)
    .then(response=>{
     setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  /**
   * @author Daniel Martinez
   * @fecha 12/05/2022
   * Servicio post que se encarga de guardar un post
   * @param post: el post que se guardar como json con los datos iduser, title, body
   * @returns retorna el post creado
   */
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

  /**
   * @author Daniel Martinez
   * @fecha 12/05/2022
   * Servicio put que se encarga de editar un post
   * @param id: id del post a editar
   * @param post: el post que se guardar como json con los datos id, iduser, title, body
   * @returns retorna el post creado
   */
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

   /**
   * @author Daniel Martinez
   * @fecha 12/05/2022
   * Servicio delete que se encarga de eliminar un post
   * @returns codigo de servicio exitoso
   */
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

  /**
   * @author Daniel Martinez
   * @fecha 12/05/2022
   * Metodo que se encarga de abrir o cerrar el modal de creacion o edicion
   * @param {el post que fue seleccionado} post 
   * @param {en caso que sea editar o crear} caso 
   */
  const seleccionarPost=(post, caso)=>{
    setPostSeleccionado(post);
    (caso==="Editar")?abrirCerrarModalEditar()
    :
    abrirCerrarModalEliminar()
  }

  /**
   *  @author Daniel Martinez
   * @fecha 12/05/2022
   * Metodo para abrir o cerrar el modal de creacion
   */
  const abrirCerrarModalInsertar=()=>{
    setPostSeleccionado([]);
    setModalInsertar(!modalInsertar);
  }

  /**
   *  @author Daniel Martinez
   * @fecha 12/05/2022
   * Metodo para abrir o cerrer el modal de editar
   */
  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  /**
   *  @author Daniel Martinez
   * @fecha 12/05/2022
   * Metodo para abrir o cerrar el modal de eliminacion
   */
  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  useEffect(()=>{
    peticionGet();
  }, [])

  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo Post</h3>

      <div class="row">

        <div class="col-6">

        <TextField className={styles.inputMaterial} label="Id de usuario" name="userId" onChange={handleChange}/>
      <br />

        </div>

        <div class="col-6">

        <TextField className={styles.inputMaterial} label="Titulo" name="title" onChange={handleChange}/>          
<br />
          
        </div>

      </div>

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

      <div class="row">

        <div class="col-6">

        <TextField className={styles.inputMaterial} label="Id de usuario" name="userId" onChange={handleChange} value={postSeleccionado&&postSeleccionado.userId}/>
        
        </div> 
        
        <div class="col-6">

        <TextField className={styles.inputMaterial} label="Titulo" name="title" onChange={handleChange} value={postSeleccionado&&postSeleccionado.title}/>          

        </div>
      </div>

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
