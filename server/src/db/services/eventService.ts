// gpt generated
//needs review 
//created a service layer to keep from eventController from getting messy
import DBConnector from '../db/dbConnector';
//fix import
import { Models } from '../db/initConnection';

const Event = Models.Event;

export async function getAllEvents() {
  return await Event.findAll();
}

export async function getEventById(id: number) {
  return await Event.find(id);
}

export async function createEvent(data: any) {
  const event = await Event.create(data);
  await event.save();
  return event;
}

export async function updateEvent(id: number, data: any) {
  const event = await Event.find(id);
  if (!event) throw new Error('Event not found');
  Object.assign(event, data);
  await event.save();
  return event;
}

export async function deleteEvent(id: number) {
  const event = await Event.find(id);
  if (!event) throw new Error('Event not found');
  await event.destroy();
}
