import React, { useState, useEffect } from 'react';
import Login from './login'
import io from 'socket.io-client';

const socket = io('https://8080-acf4d1e3-adca-4dbd-aeba-b30ed57f9e1c.ws-us02.gitpod.io/');

function App() {

    const [messages, setMessages] = useState([]);
    const [logged, setLogged] = useState(false);
    const [myName, setMyName] = useState(false);
    const [reset, setReset] = useState('');

    useEffect(() => {

        const mergeState = message => setMessages(message);
        
        socket.on('hystoricMessages', mergeState);

        return () => socket.off('hystoricMessages', mergeState);

    }, [messages]);
    

    useEffect(() => {

        const mergeState = message => setMessages(array => [...array, message]);

        socket.on('updateMessages', mergeState);

        return () => socket.off('updateMessages', mergeState);

    }, []);


    useEffect(() => {

        const mergeState = name => setMessages(array => [...array, {
            name,
            Textmessages: 'Entrou',
            entry: true
        }]);

        socket.on('newLogin', mergeState);

        return () => socket.off('newLogin', mergeState);

    }, [logged]);


    const sendMessages = form => {
        form.preventDefault();

        const Textmessages = form.currentTarget.messages.value;

        if (myName && Textmessages.length) {

            socket.emit('SendMessage', { 
                Textmessages, 
                name: myName,
                entry: false
            });

            setMessages(array => [...array, {
                name: myName, 
                Textmessages 
            }]);
            
            setReset('');
            
        } else {
            login(form.currentTarget.userName.value);
        }
    }

    const login = login => {

        setMyName(login);

        socket.emit('logeed', login);

        setLogged(item => item = !item);

    }

    return (
        <form onSubmit={e => sendMessages(e)}>
            {!logged && <Login />}
            <ul>
                {messages.map(({ name, Textmessages, entry }, indece) => (
                    <li key={indece} className={entry ? 'entry' : 'message'}>
                        <strong>{name}</strong>
                        <p>{Textmessages}</p>
                    </li>
                ))}
            </ul>
             <input onChange={({currentTarget}) => setReset(currentTarget.value)} name="messages" placeholder="Your Message" value={reset} />
            <button type="submit">Enviar</button>
        </form>
    );
}

export default App;
