//NoteCard.js
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { deletePost, updatePin, fetchNotes } from "../actions/notes";
import { useDispatch } from "react-redux";
import "./NoteCard.css";

const NoteCard = ({ prop, currentId, setCurrentId, setOpen }) => {
  const dispatch = useDispatch();
  const [pinned, setPinned] = useState(false);

  const handlePinClick = async () => {
    await dispatch(updatePin(prop._id));
    setPinned(!pinned);
    await dispatch(fetchNotes());
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "8",
            backgroundColor: "rgb(36, 35, 35)",
            color: "white",
            border: "1px solid #f4b304",
            borderRadius: "10px",
          }}
          className="expand-on-hover"
        >
          <CardContent
            sx={{ flexGrow: 1 }}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setCurrentId(prop._id);
              setOpen(true);
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="h2"
              style={{ textDecoration: "underline" }}
            >
              {prop.title}
            </Typography>

            <Typography gutterBottom>{prop.tagline}</Typography>
            <Typography>{prop.about}</Typography>
          </CardContent>
          <hr style={{ border: "1px solid #f4b304" }} />
          <CardActions
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              size="small"
              onClick={handlePinClick}
              style={{ color: "#f4b304" }}
            >
              {prop.pinned ? "unpin" : "pin"}
            </Button>
            <Button
              size="small"
              onClick={() => {
                dispatch(deletePost(prop._id));
              }}
              style={{ color: "rgb(36, 35, 35)", backgroundColor: "#f4b304" }}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
};

export default NoteCard;
