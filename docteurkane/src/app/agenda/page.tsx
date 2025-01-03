'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { FiPlus, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { format, addDays, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventType {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    patient_id: string;
    patient_name: string;
    motif: string;
    status: string;
  };
}

interface AppointmentType {
  id: string;
  date_heure: string;
  patient: {
    id: string;
    nom: string;
    prenom: string;
  };
}

interface EventDropInfo {
  event: {
    id: string;
    start: Date;
    end: Date;
  };
}

interface EventResizeInfo {
  event: {
    id: string;
    start: Date;
    end: Date;
  };
}

export default function AgendaPage() {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentView, setCurrentView] = useState<'timeGridDay' | 'timeGridThreeDay' | 'timeGridWeek'>('timeGridDay');
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [visibleRange, setVisibleRange] = useState({
    start: new Date(),
    end: addDays(new Date(), 1)
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients (
            id,
            nom,
            prenom
          )
        `);

      if (error) throw error;

      const formattedEvents = data.map((appointment: AppointmentType) => ({
        id: appointment.id,
        title: `${appointment.patient.nom} ${appointment.patient.prenom}`,
        start: new Date(appointment.date_heure),
        end: addDays(new Date(appointment.date_heure), 1),
        extendedProps: {
          ...appointment
        }
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      toast.error('Impossible de charger les rendez-vous');
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    // Mettre à jour la vue du calendrier
    const timeoutId = setTimeout(() => {
      if (calendarRef.current) {
        const calendar = calendarRef.current.getApi();
        calendar.changeView(currentView);
        calendar.gotoDate(new Date());
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [currentView]);

  useEffect(() => {
    // Mettre à jour la plage visible en fonction de la vue
    const today = new Date();
    let newEnd;
    
    switch (currentView) {
      case 'timeGridDay':
        newEnd = addDays(today, 1);
        break;
      case 'timeGridThreeDay':
        newEnd = addDays(today, 3);
        break;
      case 'timeGridWeek':
        newEnd = addDays(today, 7);
        break;
      default:
        newEnd = addDays(today, 1);
    }

    setVisibleRange({
      start: today,
      end: newEnd
    });
  }, [currentView]);

  const handleViewChange = (newView: 'timeGridDay' | 'timeGridThreeDay' | 'timeGridWeek') => {
    setTimeout(() => {
      setCurrentView(newView);
    }, 0);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'planifié': return '#4F46E5';
      case 'confirmé': return '#059669';
      case 'annulé': return '#DC2626';
      case 'terminé': return '#6B7280';
      default: return '#4F46E5';
    }
  };

  const handleEventClick = (info: { event: EventType }) => {
    setSelectedEvent(info.event);
    setShowEventModal(true);
  };

  const handleDateClick = (info: { date: Date }) => {
    router.push(`/rendez-vous/nouveau?date=${format(info.date, "yyyy-MM-dd'T'HH:mm")}`);
  };

  const handleRangeChange = useCallback((info: { 
    start: Date; 
    end: Date; 
    view: { 
      type: string;
      calendar: {
        currentData: {
          currentViewType: string;
        };
      };
    }; 
  }) => {
    // Ne mettre à jour que si les dates sont différentes
    if (
      isInitialLoad || 
      visibleRange.start.getTime() !== info.start.getTime() || 
      visibleRange.end.getTime() !== info.end.getTime()
    ) {
      setVisibleRange({
        start: info.start,
        end: info.end
      });
      setIsInitialLoad(false);
    }
  }, [visibleRange, isInitialLoad]);

  const handleEventDrop = async (info: EventDropInfo) => {
    try {
      const { event } = info;
      const { error } = await supabase
        .from('appointments')
        .update({
          date_heure: event.start.toISOString(),
        })
        .eq('id', event.id);

      if (error) throw error;
      toast.success('Rendez-vous déplacé avec succès');
    } catch (error) {
      console.error('Erreur lors du déplacement du rendez-vous:', error);
      toast.error('Impossible de déplacer le rendez-vous');
    }
  };

  const handleEventResize = async (info: EventResizeInfo) => {
    try {
      const { event } = info;
      const { error } = await supabase
        .from('appointments')
        .update({
          date_heure: event.start.toISOString(),
          duree: format(
            differenceInMinutes(event.end, event.start),
            "'minutes'"
          ),
        })
        .eq('id', event.id);

      if (error) throw error;
      toast.success('Durée du rendez-vous modifiée avec succès');
    } catch (error) {
      console.error('Erreur lors de la modification de la durée:', error);
      toast.error('Impossible de modifier la durée du rendez-vous');
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          statut: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      setEvents(events.map(event => 
        event.id === id 
          ? { 
              ...event, 
              backgroundColor: getStatusColor(status),
              borderColor: getStatusColor(status),
              extendedProps: { ...event.extendedProps, status }
            }
          : event
      ));
      
      setShowEventModal(false);
      toast.success('Statut du rendez-vous mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Impossible de mettre à jour le statut');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
            <div className="flex items-center gap-4">
              <div className="flex rounded-lg overflow-hidden">
                <button
                  onClick={() => handleViewChange('timeGridDay')}
                  className={`px-4 py-2 ${
                    currentView === 'timeGridDay'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Jour
                </button>
                <button
                  onClick={() => handleViewChange('timeGridThreeDay')}
                  className={`px-4 py-2 ${
                    currentView === 'timeGridThreeDay'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  3 Jours
                </button>
                <button
                  onClick={() => handleViewChange('timeGridWeek')}
                  className={`px-4 py-2 ${
                    currentView === 'timeGridWeek'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Semaine
                </button>
              </div>
              <button
                onClick={() => router.push('/rendez-vous/nouveau')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Nouveau RDV
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div className="calendar-container h-[800px]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: ''
              }}
              views={{
                timeGridThreeDay: {
                  type: 'timeGrid',
                  duration: { days: 3 },
                  buttonText: '3 jours',
                  titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
                  dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true }
                },
                timeGridWeek: {
                  type: 'timeGrid',
                  duration: { days: 7 },
                  buttonText: 'Semaine',
                  titleFormat: { year: 'numeric', month: 'long' },
                  dayHeaderFormat: { weekday: 'long', month: 'numeric', day: 'numeric', omitCommas: true }
                }
              }}
              visibleRange={visibleRange}
              validRange={visibleRange}
              locale="fr"
              firstDay={1}
              allDaySlot={false}
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:15:00"
              slotLabelInterval="01:00"
              events={events}
              editable={true}
              droppable={true}
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              datesSet={handleRangeChange}
              nowIndicator={true}
              scrollTime={new Date().getHours() + ":00:00"}
              expandRows={true}
              stickyHeaderDates={true}
              dayMaxEvents={true}
              eventMaxStack={3}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
              eventContent={(eventInfo) => {
                return (
                  <div className="w-full h-full p-1">
                    <div className="text-sm font-medium truncate">
                      {eventInfo.timeText}
                    </div>
                    <div className="text-xs truncate">
                      {eventInfo.event.title}
                    </div>
                  </div>
                );
              }}
            />
          </div>

          {/* Modal de détails du rendez-vous */}
          {showEventModal && selectedEvent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div
                className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4"
              >
                <h2 className="text-2xl font-bold mb-4">Détails du rendez-vous</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiUser className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{selectedEvent.extendedProps.patient_name}</div>
                      <div className="text-sm text-gray-500">Patient</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">
                        {format(selectedEvent.start, 'EEEE d MMMM yyyy', { locale: fr })}
                      </div>
                      <div className="text-sm text-gray-500">Date</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiClock className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">
                        {format(selectedEvent.start, 'HH:mm')} - {format(selectedEvent.end, 'HH:mm')}
                      </div>
                      <div className="text-sm text-gray-500">Horaire</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="font-medium mb-2">Motif</div>
                    <div className="text-gray-600">{selectedEvent.extendedProps.motif}</div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="font-medium mb-2">Statut</div>
                    <div className="flex gap-2">
                      {['planifié', 'confirmé', 'annulé', 'terminé'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateAppointmentStatus(selectedEvent.id, status)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedEvent.extendedProps.status === status
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
