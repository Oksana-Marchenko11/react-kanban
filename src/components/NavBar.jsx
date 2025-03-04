import React from "react";
import { Nav, ListGroup, ListGroupItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";

export const Navbar = () => {
  const userRepoIssues = useSelector((state) => state.searchQuery.searchQuery);
  const parts = userRepoIssues.split("/");
  const http = parts[0];
  const gitHub = parts[2].slice(4, 100);
  const userName = parts[4];
  const repoName = parts[5];
  const userHitHub = http.concat("//", gitHub, "/", userName);
  const userHitHubRepo = http.concat(
    "//",
    gitHub,
    "/",
    userName,
    "/",
    repoName
  );

  return (
    <Nav>
      <ListGroup horizontal>
        <ListGroupItem>
          <NavLink href={userHitHub}>{userName}</NavLink>
        </ListGroupItem>
        <ListGroupItem>
          <NavLink href={userHitHubRepo}>{repoName}</NavLink>
        </ListGroupItem>
        <ListGroupItem>STARS</ListGroupItem>
      </ListGroup>
    </Nav>
  );
};
export default Navbar;
