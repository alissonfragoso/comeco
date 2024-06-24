import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../global.css';
import Chatbranco from '../../assets/Icones/chat-branco.svg';
import Chatpreto from '../../assets/Icones/chat-preto.svg';
import Coracaovermelho from '../../assets/Icones/coraçãoVermelho.svg';
import Coracao from '../../assets/Icones/coração.svg';
import Send from '../../assets/Icones/send.svg';
import Twitter from '../../assets/Icones/Twitter.svg';
import Instagram from '../../assets/Icones/Instagram.svg';
import Youtube from '../../assets/Icones/youtube.svg';
import Tiktok from '../../assets/Icones/tiktok.svg';
import api from '../../server/api';

import Everest from '../../assets/Imagens/Everest.jpg';

export default function Main() {

    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [textcomentario, setTextComentario] = useState("");
    const [idfoto, setIdFoto] = useState(0);
    const [nomefoto, setNomeFoto] = useState("");
    const [totalLike, setTotalLike] = useState(0);
    const [totalcomentario, setTotalComentario] = useState(0);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [id, setId] = useState(0);
    const [fotos, setFotos] = useState([]);
    const [show, setShow] = useState(false);
    const fechaModal = () => setShow(false);

    const [showlogin, setShowLogin] = useState(false);
    const fechaModalLogin = () => setShowLogin(false);
    const abrirModalLogin = () => setShowLogin(true);

    const [reacoes, setReacoes] = useState([]);
    const abrirModal = async (codigoFoto, nomeFoto, totalRecao, totalComentario) => {
        if (id === 0) {
            alert("Necessário logar no sistema para fazer um comentário ")
        } else {
            setIdFoto(codigoFoto);
            setNomeFoto(nomeFoto)
            setTotalComentario(totalComentario);
            setTotalLike(totalRecao);
            setShow(true);
        }
    };

    const getLike = async () => {
        try {
            const resposta = await api.get(`/reacao/${id}`);
            if (resposta.status === 200) {
                setReacoes(resposta.data.reacao)
            }
        } catch (error) {
            return "";
        }
    };

    const saveToComment = () => {
        if (textcomentario.length <2) {
            alert("Não é possivel enviar um comentário")
        } else {
            api.post("/comentario", { idfoto, id, textcomentario })
                .then((resposta) => {
                    if (resposta.status === 201) {
                        setTextComentario("");
                        listFotos();
                        setShow(false);
                    } else {
                        alert("Houve um erro ao salvar o comentário")
                    }
                })
        }
    }

    const logar = () => {
        if(email.length===0 || senha.length===0){
            alert("Email ou senha incorreto")
        }else{
            api.post("/usuario", { email, senha })
                .then((resposta) => {
                    setId(resposta.data.usuario.cod);
                    console.log(resposta.data);
                    listFotos();
                    fechaModalLogin();
                })
                .catch((erro) => {
                    console.error("Erro ao fazer login: ", erro);
                });

        }
    };

    const addLike = (id_foto) => {
        if (id === 0 || id === null) {
            alert("precisa logar para dá um like")
        } else {
            api.post("/reacao", { id_foto, id_usuario: id })
                .then((resposta) => {
                    if (resposta.status === 201) {
                        getLike()
                        listFotos();
                    }
                    if (resposta.status == 404) {
                        listFotos();
                    }

                }
                )
                .catch((erro) => {
                    console.error("Erro ao fazer login: ", erro);
                });
        }
    }

    const listFotos = async () => {
        try {
            const response = await api.get("/foto");
            setFotos(response.data.fotos);

        } catch (error) {
            console.error("Erro ao buscar fotos:", error);
        }
    };

    useEffect(() => {
        listFotos();
        getLike();
    }, []);




    const olharReacao = (codFoto, codUsuario) => {
        return reacoes.some(reacao => reacao.cod_foto === codFoto && reacao.cod_usuario === codUsuario);
    };

    return (
        <div className="container">
            <div className="header-content">
                <h2 className="title">Fotografia Gelada</h2>
                <button className='login-button' onClick={abrirModalLogin}>Login</button>
            </div>
            <h3 className='section-title'>Home</h3>
            <>
                <Modal show={show} onHide={fechaModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{nomefoto}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div>
                                {nomefoto && <img src={require(`../../assets/Imagens/${nomefoto}`)} alt="fotos" className="comment-image" />}
                            </div>
                            <div className="reaction-section">
                                <div>
                                    <img src={Coracaovermelho} width={20} alt="likes" />
                                    {totalLike}
                                    <label>Curtidas</label>
                                </div>
                                <div>
                                    <img src={Chatpreto} width={20} alt="comments" />
                                    {totalcomentario}
                                    <label>Comentários</label>
                                </div>
                            </div>
                            <div className="comment-section">
                                <img src={Chatpreto} width={20} alt="add comment" />
                                <input
                                    type="text"
                                    className="comment-input"
                                    placeholder="adicionar comentário"
                                    value={textcomentario}
                                    onChange={(e) => setTextComentario(e.target.value)}
                                />
                                <img src={Send} onClick={(e) => { saveToComment() }} width={20} alt="send" />
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={showlogin} onHide={fechaModalLogin}>
                    <Modal.Header closeButton>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div className='login-input-container'>
                                <label>E-mail</label>
                                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='login-input-container'>
                                <label>Senha</label>
                                <input type='text' value={senha} onChange={(e) => setSenha(e.target.value)} />
                            </div>
                            <div className="button-container">
                                <button className="cancel-button">Cancelar</button>
                                <button onClick={logar} className="login-button-submit">Entrar</button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
            <div className="gallery-grid">
                {id}
                {fotos.map((foto, index) => (
                    <div className={`card ${index === 0 ? 'card-large' : index === 1 ? 'card-tall' : index === 2 ? 'card-small-1' : index === 3 ? 'card-small-2' : index === 4 ? 'card-vertical' : index === 5 ? 'card-wide' : index === 6 ? 'card-small-3' : 'card-small-4'}`} key={index}>
                        <img src={require(`../../assets/Imagens/${foto.nomefoto}`)} className="card-image" alt={foto.nomefoto} />
                        <div className="card-overlay">
                            <div className="card-likes">

                                <img
                                    onClick={() => addLike(foto.Cod)}
                                    src={olharReacao(foto.Cod, id) ? Coracaovermelho : Coracao}
                                    width={18}
                                    alt="like"
                                />
                                {foto.totalreacao}
                            </div>
                            <div className="card-comments">
                                <img
                                    onClick={() => abrirModal(...[foto.Cod, foto.nomefoto, foto.totalreacao, foto.totalcomentario])}
                                    src={Chatbranco}
                                    width={20} alt="comments" />
                                {foto.totalcomentario}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="footer">
                <div className="brand">
                    <p>Fotografia Gelada</p>
                </div>
                <div className="social-media">
                    <img src={Twitter} width={16} height={16} alt="Twitter" />
                    <img src={Instagram} width={16} height={16} alt="Instagram" />
                    <img src={Youtube} width={16} height={16} alt="Youtube" />
                    <img src={Tiktok} width={16} height={16} alt="Tiktok" />
                </div>
                <div className="copyright">
                    <p>Corporation - 2024</p>
                </div>
            </div>
        </div>
    );
}
