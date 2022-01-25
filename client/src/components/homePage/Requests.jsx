import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Request from './Request'

const Ul = styled.ul`
    list-style-type: none;
    border: 0;
    margin: 0;
    padding: 0;
`

const Requests = () => {
    const user = JSON.parse(localStorage.getItem('user')) || undefined;

    const [requests, setRequests] = useState([]);

    const getFriendsRequests = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/relations/users/${user.id}/requests`, {
                headers: {
                    Authorization: (localStorage.getItem('token'))
                }
            });

            if (res.data) {
                setRequests(res.data)
            }
        } catch (err) {
            console.log(err);
        }
    }

    // fetch all user's friends requests
    useEffect(() => {
        getFriendsRequests();
    }, []);

    const acceptRequest = async (requestId) => {
        try {
            const res = await axios.put(`http://localhost:4000/api/relations/${requestId}`, {
                headers: {
                    Authorization: (localStorage.getItem('token'))
                }
            });

            if (res.data.message == "Relation updated") {
                updateRequests(requestId);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const declineRequest = async (requestId) => {
        try {
            const res = await axios.delete(`http://localhost:4000/api/relations/${requestId}`, {
                headers: {
                    Authorization: (localStorage.getItem('token'))
                }
            });

            if (res.data.message == "Relation deleted") {
                updateRequests(requestId);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const updateRequests = (requestId) => {
        setRequests(oldRequests => [...oldRequests].filter(request => request.id != requestId))
    }

    return (
        <div>
            <p>Requests</p>
            <Ul>
                {requests.length > 0 &&
                    requests.map(request =>
                        <Request
                            key={request.id}
                            request={request}
                            acceptRequest={acceptRequest}
                            declineRequest={declineRequest}
                        />)
                }
            </Ul>
        </div>
    )
}

export default Requests
