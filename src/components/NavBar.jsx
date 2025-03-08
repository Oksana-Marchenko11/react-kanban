import React from "react";
import { Nav, ListGroup, ListGroupItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";

export const Navbar = () => {
  const data = useSelector((state) => state.searchQuery.searchQuery);
  console.log(data);
  if (!data || !data.owner || !data.owner.login || !data.name) {
    return null;
  }
  const userLink = `https://github.com/${data.owner.login}/`;
  const repoLink = `https://github.com/${data.owner.login}/${data.name}/`;
  return (
    <Nav>
      <ListGroup horizontal>
        <ListGroupItem>
          <NavLink href={userLink}>{data.owner.login}</NavLink>
        </ListGroupItem>
        <ListGroupItem>
          <NavLink href={repoLink}>{data.name}</NavLink>
        </ListGroupItem>
        <ListGroupItem>{data.stargazers_count}</ListGroupItem>
      </ListGroup>
    </Nav>
  );
};

export default Navbar;
