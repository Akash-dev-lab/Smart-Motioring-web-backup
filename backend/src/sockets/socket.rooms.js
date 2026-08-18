export const getUserRoom = (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    return `user:${userId}`;
};

export const joinUserRoom = (socket) => {

    if (!socket.user?.userId) {
        throw new Error("Authenticated user is required");
    }

    const room = getUserRoom(socket.user.userId);

    socket.join(room);

    console.log(
        `👤 Socket ${socket.id} joined room ${room}`
    );

    return room;
};

export const leaveUserRoom = (socket) => {

    if (!socket.user?.userId) {
        return;
    }

    const room = getUserRoom(socket.user.userId);

    socket.leave(room);

    console.log(
        `👤 Socket ${socket.id} left room ${room}`
    );

    return room;
};