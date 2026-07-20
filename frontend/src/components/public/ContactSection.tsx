import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ContactFormData {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const ContactSection: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await api.post('/contacts', data);
      setSuccessMessage(res.data.message || 'Mensaje enviado exitosamente.');
      reset();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Error al enviar el mensaje. Inténtalo nuevamente.');
    }
  };

  return (
    <section id="contacto" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Contacto Directo</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Iniciemos Tu Próximo Proyecto
          </p>
          <p className="text-slate-400 text-base leading-relaxed">
            Completa el formulario a continuación o comunícate directamente con nuestros especialistas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details & Google Maps Embed */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card p-8 rounded-3xl space-y-6 border border-slate-800">
              <h3 className="text-xl font-bold text-white font-display">Información Corporativa</h3>
              
              <div className="space-y-5 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Dirección Central</h5>
                    <p className="text-slate-400 text-xs mt-0.5">Av. Providencia 1234, Oficina 501, Santiago, Chile</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Teléfonos de Atención</h5>
                    <p className="text-slate-400 text-xs mt-0.5">+56 9 1234 5678 / +56 2 2987 6543</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Correos Electrónicos</h5>
                    <p className="text-slate-400 text-xs mt-0.5">contacto@arions.tech / obras@arions.tech</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Horario Comercial</h5>
                    <p className="text-slate-400 text-xs mt-0.5">Lunes a Viernes: 08:30 - 18:30 hrs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Interactive Frame */}
            <div className="rounded-3xl overflow-hidden border border-slate-800 h-64 shadow-xl">
              <iframe
                title="Google Maps ARIONS"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.988298754199!2d-70.61257468480137!3d-33.42358898078129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf63152d2f7f%3A0x6b8f10f88e1a1b!2sAv.%20Providencia%201234%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-2xl font-bold text-white font-display">Envíanos una Consulta</h3>

              {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nombre Completo *</label>
                    <input
                      type="text"
                      {...register('name', { required: 'El nombre es obligatorio' })}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Empresa / Organización</label>
                    <input
                      type="text"
                      {...register('company')}
                      placeholder="Ej. Tech Solutions SpA"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Correo Electrónico *</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'El correo es obligatorio',
                        pattern: { value: /^\S+@\S+$/i, message: 'Formato de correo no válido' }
                      })}
                      placeholder="juan@empresa.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="+56 9 1234 5678"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asunto de la Consulta *</label>
                  <input
                    type="text"
                    {...register('subject', { required: 'El asunto es obligatorio' })}
                    placeholder="Cotización de desarrollo / Remodelación de oficina..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  {errors.subject && <p className="text-xs text-rose-400 mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mensaje o Detalle del Requerimiento *</label>
                  <textarea
                    rows={4}
                    {...register('message', { required: 'El mensaje es obligatorio' })}
                    placeholder="Describe los requerimientos principales de tu proyecto..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none resize-none"
                  ></textarea>
                  {errors.message && <p className="text-xs text-rose-400 mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Consulta por SMTP'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
