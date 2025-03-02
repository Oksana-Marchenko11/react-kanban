import React, { useState } from "react";
import { Nav, ListGroup, ListGroupItem } from "react-bootstrap";

export const Navbar = () => {
  return (
    <Nav>
      <ListGroup horizontal>
        <ListGroupItem>USER NAME</ListGroupItem>
        <ListGroupItem>REPO NAME</ListGroupItem>
        <ListGroupItem>STARS</ListGroupItem>
      </ListGroup>
    </Nav>
  );
};
export default Navbar;
