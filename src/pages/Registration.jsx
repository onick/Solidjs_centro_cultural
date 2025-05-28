import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import eventStore from '../stores/eventStore';
import { visitorActions } from '../stores/visitorStore';

function Registration() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = createSignal(null);
  const [showConfirmation, setShowConfirmation] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [formData, setFormData] = createSignal({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventId: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simular registro (integrar con API real)
      const registration = {
        ...formData(),
        id: Date.now(),
        registrationCode: generateCode(),
        timestamp: new Date(),
      };
      
      visitorActions.addRegistration(registration);
      setShowConfirmation(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        eventId: null,
      });
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <Layout>
      <div class="registration-page">
        <div class="page-header">
          <h1>📝 Registro de Visitantes</h1>
          <p>Regístrate para participar en nuestros eventos</p>
        </div>
