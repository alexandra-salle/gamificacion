import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

import politico1 from "./Images/Politicos/politico1.jpg";
import politico2 from "./Images/Politicos/politico2.jpg";
import politico3 from "./Images/Politicos/politico3.jpg";
import politico4 from "./Images/Politicos/politico4.jpg";
import politico5 from "./Images/Politicos/politico5.jpg";
import politico6 from "./Images/Politicos/politico6.png";
import politico7 from "./Images/Politicos/politico7.png";
import politico8 from "./Images/Politicos/politico8.png";

import audioHimno from "./Sounds/Himno_URSS.mp3";
import audioGta from "./Sounds/GTA_Mision.mp3";
import audioCabra from "./Sounds/Cabra_Gritando.mp3";
import audioNuclear from "./Sounds/Alerta_Nuclear.mp3";

import audioPedro from "./Sounds/Pedro_Piqueras.mp3";
import audioTit from "./Sounds/Titanic_flute.mp3";
import audioMatar from "./Sounds/Me_Matar.mp3";


import audioGadget from "./Sounds/Inspector_Gadget.mp3"

import audioExpediente from "./Sounds/Expediente_X.mp3";
import audioMartin from "./Sounds/Martín_Matin.mp3";
import audioPers from "./Sounds/persecución.mp3";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sonidos" element={<Sonidos />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const [newUser, setNewUser] = useState({
    name: "",
    points: 0,
    señor: false
  });
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const imagesData = [
    politico1,
    politico2,
    politico3,
    politico4,
    politico5,
    politico6,
    politico7,
    politico8
  ];

  const createUser = async () => {
    const randomIndex = Math.floor(Math.random() * imagesData.length);
    const randomImage = imagesData[randomIndex];

    await addDoc(usersCollectionRef, {
      name: newUser.name,
      points: Number(newUser.points),
      señor: newUser.señor,
      image: randomImage
    });

    setNewUser({
      name: "",
      points: 0,
      señor: false
    });
  };

  const updateUser = async (id, points) => {
    const pointsToAdd = parseInt(prompt(`¿Cuántos puntos desea añadir?`)) || 0;

    const userDoc = doc(db, "users", id);
    const newFields = { points: points + pointsToAdd };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();

    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  }, []);

  const señores = users.filter((user) => user.señor);
  const juniors = users.filter((user) => !user.señor);

  // Calcular la suma de puntos para cada equipo
  const totalPointsSeñores = señores.reduce((acc, curr) => acc + curr.points, 0);
  const totalPointsJuniors = juniors.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div>
      <div className="divCrear">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(event) => {
            setNewUser({ ...newUser, name: event.target.value });
          }}
        />
        <input
          type="number"
          placeholder="Points"
          value={newUser.points}
          onChange={(event) => {
            setNewUser({ ...newUser, points: event.target.value });
          }}
        />
        <label className="checkbox-label">
          Señor:
          <input
            type="checkbox"
            checked={newUser.señor}
            onChange={(event) => {
              setNewUser({ ...newUser, señor: event.target.checked });
            }}
            className="styled-checkbox"
          />
        </label>

        <button className="btnCreate" onClick={createUser}>
          Create User
        </button>
        <Link to="/sonidos">
          <button className="btnSonidos">Sonidos</button>
        </Link>
      </div>

      <div className="container">
        <div className="column">
          <h1>Señores (Total points: {totalPointsSeñores})</h1>
          {señores.map((user) => (
            <div className="userMember" key={user.id}>
              <div className="divMember">
                <div className="member">
                  <img src={user.image} alt={`${user.image}`} />
                </div>
                <div>
                  <h2>{user.name}</h2>
                  <h2>Points: {user.points}</h2>
                </div>
              </div>
              <button
                onClick={() => {
                  updateUser(user.id, user.points);
                }}
              >
                Añadir Puntos
              </button>
              <button
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
        <div className="column">
          <h1>Juniors (Total points: {totalPointsJuniors})</h1>
          {juniors.map((user) => (
            <div key={user.id}>
              <div className="divMember">
                <div className="member">
                  <img src={user.image} alt={`${user.image}`} />
                </div>
                <div>
                  <h2>{user.name}</h2>
                  <h2>Points: {user.points}</h2>
                </div>
              </div>
              <button
                onClick={() => {
                  updateUser(user.id, user.points);
                }}
              >
                Añadir Puntos
              </button>
              <button
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


function Sonidos() {
  const playSound = (audioId) => {
    const audioElement = document.getElementById(audioId);
    audioElement.play();
  };

  const pauseSound = (audioId) => {
    const audioElement = document.getElementById(audioId);
    audioElement.pause();
  };

  return (
    <div>
      <div className="divCrear">
        <Link to="/">
          <button className="btnSonidos">Sprint</button>
        </Link>
      </div>
      <div className="container">
        <div className="container_cards">
          <div className="card">
            <img
              src="https://img.freepik.com/vector-premium/icono-peligro-radiacion-alerta-amenaza-radiactiva-simbolo-precaucion-nuclear_342166-429.jpg?w=2000"
              onClick={() => playSound('Nuclear_audio')}
              alt="Play Sound"
            />
            <audio id="Nuclear_audio" src={audioNuclear}></audio>
            <p>Alerta Nuclear</p>
            <button onClick={() => pauseSound('Nuclear_audio')}>Stop</button>
          </div>
          <div class="card">
            <img src="https://animapedia.org/wp-content/uploads/2019/07/cabra-1.jpg"
              onClick={() => playSound('cabra_audio')} alt="Play Sound"/>
              <audio id="cabra_audio" src={audioCabra}></audio>
              <p>Grito Cabra</p>
              <button onClick={() => pauseSound('cabra_audio')}>Stop</button>
          </div>
          <div class="card">
            <img src="https://cdn2.unrealengine.com/Diesel%2Fproductv2%2Fgrand-theft-auto-v%2Fhome%2FGTAV_EGS_Artwork_1920x1080_Hero-Carousel_V06-1920x1080-1503e4b1320d5652dd4f57466c8bcb79424b3fc0.jpg"
              onClick={() => playSound('gta_audio')} alt="Play Sound"/>
              <audio id="gta_audio" src={audioGta}></audio>
              <p>GTA Mision Complete</p>
              <button onClick={() => pauseSound('gta_audio')}>Stop</button>
          </div>
          <div class="card">
            <img class="img_card"
              src="https://okdiario.com/img/2022/02/24/-que-paises-formaron-parte-de-la-urss_.jpg"
              onClick={() => playSound('himnoUrss')} alt="Play Sound"/>
              <audio id="himnoUrss" src={audioHimno}></audio>
              <p>URSS</p>
              <button  onClick={() => pauseSound('himnoUrss')}>Stop</button>
          </div>
          <div class="card">
            <img class="img_card"
              src="https://i.ytimg.com/vi/Gotz1iO_w4E/maxresdefault.jpg"
              onClick={() => playSound('matar')} alt="Play Sound"/>
              <audio id="matar" src={audioMatar}></audio>
              <p>Me voy a matar</p>
              <button  onClick={() => pauseSound('matar')}>Stop</button>
          </div>
          <div class="card">
            <img class="img_card"
              src="https://images.ecestaticos.com/c4hpdnLzRo8r-38mIYxZNVdheGk=/0x0:1481x843/1200x900/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fa2a%2F41c%2Ff55%2Fa2a41cf555c504efd8b2be886bcf93ee.jpg"
              onClick={() => playSound('piqueras')} alt="Play Sound"/>
              <audio id="piqueras" src={audioPedro}></audio>
              <p>Pedro Piqueras</p>
              <button onClick={() => pauseSound('piqueras')}>Stop</button>
          </div>
          <div class="card">
            <img class="img_card"
              src="https://historia.nationalgeographic.com.es/medio/2021/02/12/titanic_dd4b0e80_907x805.jpg"
              onClick={() => playSound('titanic')} alt="Play Sound"/>
              <audio id="titanic" src={audioTit}></audio>
              <p>Titanic</p>
              <button  onClick={() => pauseSound('titanic')}>Stop</button>
          </div>
          <div class="card">
            <img class="img_card"
              src="https://i1.wp.com/clipset.com/wp-content/uploads/2013/10/gadget.jpg?ssl=1"
              onClick={() => playSound('ins_gad')} alt="Play Sound"/>
              <audio id="ins_gad" src={audioGadget}></audio>
              <p>Inspector Gadget</p>
              <button onClick={() => pauseSound('ins_gad')}>Stop</button>
          </div>
          <div class="card">
            <img class="img_card"
              src="https://pics.filmaffinity.com/Expediente_X_Serie_de_TV-450691206-large.jpg"
              onClick={() => playSound('exp_x')} alt="Play Sound"/>
              <audio id="exp_x" src={audioExpediente}></audio>
              <p>Expediente X</p>
              <button  onClick={() => pauseSound('exp_x')}>Stop</button>
          </div>
          <div class="card">
            <img class="img_card"
              src="http://1.bp.blogspot.com/-b4doarIZ2xM/U1PEG-G2bNI/AAAAAAAA4Vk/ey4TH2aj1Sg/s1600/martin10.jpg"
              onClick={() => playSound('martin_martin')} alt="Play Sound"/>
              <audio id="martin_martin" src={audioMartin}></audio>
              <p>Martin Martin</p>
              <button  onClick={() => pauseSound('martin_martin')}>Stop</button>
          </div>
          <div class="card">
            <img class="img_card"
              src="https://www3.gobiernodecanarias.org/medusa/proyectos/proyectonewton/wp-content/uploads/sites/20/2018/12/males-2512006_640.jpg"
              onClick={() => playSound('persecucion')} alt="Play Sound"/>
              <audio id="persecucion" src={audioPers}></audio>
              <p>Persecucion</p>
              <button  onClick={() => pauseSound('persecucion')}>Stop</button>
          </div>

        </div>
      </div>
    </div>
  );
}


export default App;
