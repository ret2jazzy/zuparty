import Link from 'next/link';
import React from 'react'
import styled from 'styled-components';
import { ZuEvent } from '../src/types';
import { Button } from './core/Button';

type EventListItemProps = {
  event: ZuEvent;
}

const EventListItem = ({ event }: EventListItemProps) => {
  return (
    <EventItem href={`/event/${event.id}`}>
      <p>{event.name}</p>
      <Button style={{ width: 180 }}>
        View
      </Button>
    </EventItem>
  )
}

export default EventListItem

const EventItem = styled.a`
  color: #fff;
  display:flex;
  flex-direction: row;
  gap: 0.5rem;
  text-decoration: none;
  align-items: center;
  justify-content: center;
`