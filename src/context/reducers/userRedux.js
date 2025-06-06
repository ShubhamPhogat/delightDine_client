const userReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_USER":
      return state; // Returns previous state (null if initial)

    case "SET_USER":
      return action.user || null; // Fallback to null if action.user is undefined

    case "SET_USER_NULL":
      return null; // Explicitly return null

    default:
      return state;
  }
};

export default userReducer;
