import React, { useState } from "react";
import { Nav, ListGroup, ListGroupItem } from "react-bootstrap";
import { useDispatch } from "react-redux";

export const Navbar = () => {
  const dispatch = useDispatch();
  return (
    <ListGroup horizontal>
      <ListGroupItem>USER NAME</ListGroupItem>
      <ListGroupItem>REPO NAME</ListGroupItem>
      <ListGroupItem>STARS</ListGroupItem>
    </ListGroup>
  );
};
export default Navbar;
