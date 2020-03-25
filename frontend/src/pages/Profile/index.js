import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './styles.css'
import api from '../../services/api'

import logoImg from '../../assets/logo.svg'
import { FiPower, FiTrash2 } from 'react-icons/fi'

export default function Profile() {
  const history = useHistory()
  const [incidents, setIncidents] = useState([])

  const ongId = localStorage.getItem('ongId')
  const ongName = localStorage.getItem('ongName')

  useEffect(() => {
    api
      .get('profile', {
        headers: {
          authorization: ongId
        }
      })
      .then(response => {
        setIncidents(response.data)
      })
  }, [ongId])

  function handleDeleteIncident(id) {
    try {
      api.delete(`incidents/${id}`, {
        headers: {
          authorization: ongId
        }
      })

      setIncidents(incidents.filter(incident => incident.id !== id))
    } catch (err) {
      alert('erro ao deletar')
    }
  }

  function handleLogout() {
    localStorage.clear()

    history.push('/')
  }

  return (
    <div className='profile-container'>
      <header>
        <img src={logoImg} alt='Be The Hero' />
        <span>Bem vindo, {ongName}</span>
        <Link className='button' to='/incidents/new'>
          Cadastrar novo caso
        </Link>
        <button onClick={handleLogout}>
          <FiPower size={18} color='#f02041' />
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>Caso</strong>
            <p>{incident.title}</p>

            <strong>Descrição</strong>
            <p>{incident.description}</p>

            <strong>valor</strong>
            <p>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(incident.value)}
            </p>

            <button>
              <FiTrash2
                onClick={() => handleDeleteIncident(incident.id)}
                size={20}
                color='a8a8b3'
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
