import React from "react";
import { Nav, ListGroup, ListGroupItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";

export const Navbar = () => {
  const data = useSelector((state) => state.searchQuery.searchQuery);
  const userName = data.user;
  const repoName = data.repo;

  const userLink = `https://github.com/${userName}/`;
  const repoLink = `https://github.com/${userName}/${repoName}/`;
  return (
    <Nav>
      <ListGroup horizontal>
        <ListGroupItem>
          <NavLink href={userLink}>{userName}</NavLink>
        </ListGroupItem>
        <ListGroupItem>
          <NavLink href={repoLink}>{repoName}</NavLink>
        </ListGroupItem>
        <ListGroupItem>STARS</ListGroupItem>
      </ListGroup>
    </Nav>
  );
};

export default Navbar;
