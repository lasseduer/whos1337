function getRoom(roomName: string) {
  return `${roomName}-${process.env.NODE_ENV}`;
}

export { getRoom };
