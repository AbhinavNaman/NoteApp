//Home.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import NoteCard from "./components/NoteCard";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { fetchNotes, createNote, updateNote } from "./actions/notes";
import ReactPaginate from "react-paginate";
import "./Home.css";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  border: "7px solid #f4b304",
  borderRadius: "20px",
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [openFirstPageAlert, setOpenFirstPageAlert] = useState();
  const [openLastPageAlert, setOpenLastPageAlert] = useState();

  const handleOpen = () => {
    setOpen(true);
    setCurrentId(null);
    setPostData({ title: "", tagline: "", about: "" });
  };
  const handleClose = () => setOpen(false);

  const [currentId, setCurrentId] = useState(null);

  const note = useSelector((state) =>
    currentId ? state.notes.notes.find((n) => n._id === currentId) : null
  );

  const [postData, setPostData] = useState({
    title: "",
    tagline: "",
    about: "",
  });

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  useEffect(() => {
    if (note) setPostData(note);
  }, [note]);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const { notes } = useSelector((state) => state.notes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentId) {
      await dispatch(updateNote(currentId, postData));
    } else {
      await dispatch(createNote(postData));
    }
    dispatch(fetchNotes());
    handleClose();
  };

  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(notes.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(notes.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, notes]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % notes.length;
    setItemOffset(newOffset);

    if (event.selected === 0) {
      setOpenFirstPageAlert(true);
      setOpenLastPageAlert(false);
    } else if (event.selected === pageCount - 1) {
      setOpenFirstPageAlert(false);
      setOpenLastPageAlert(true);
    } else {
      setOpenFirstPageAlert(false);
      setOpenLastPageAlert(false);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#f4b304" }}>
        <Toolbar>
          <TextSnippetIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NOTESApp
          </Typography>
          <Button
            color="inherit"
            onClick={handleOpen}
            sx={{ boxShadow: "6" }}
            style={{ border: "1px solid white" }}
          >
            Add Note
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            Pinned Notes
          </Typography>

          <Grid container spacing={4}>
            {currentItems
              .filter((note) => note.pinned)
              .map((card) => (
                <NoteCard
                  key={card._id}
                  prop={card}
                  currentId={currentId}
                  setCurrentId={setCurrentId}
                  setOpen={setOpen}
                />
              ))}
          </Grid>
          <br />
          <br />
          <hr style={{ border: "1px solid #f4b304" }} />
          <br />
          <br />

          <Grid container spacing={4}>
            {currentItems
              .filter((note) => !note.pinned)
              .map((card) => (
                <NoteCard
                  key={card._id}
                  prop={card}
                  currentId={currentId}
                  setCurrentId={setCurrentId}
                  setOpen={setOpen}
                />
              ))}
          </Grid>
          <br />
          <br />
          <br />
          {openFirstPageAlert && (
            <Alert
              severity="info"
              sx={{ width: "20%", margin: "auto", bgcolor: "#f4b304" }}
            >
              This is the First Page
            </Alert>
          )}
          {openLastPageAlert && (
            <Alert
              severity="info"
              sx={{ width: "20%", margin: "auto", bgcolor: "#f4b304" }}
            >
              This is the Last Page
            </Alert>
          )}
          <br />
          <ReactPaginate
            breakLabel="..."
            nextLabel=">>"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="<<"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="active"
          />
        </Container>
      </main>
      <br />
      <br />
      <hr style={{ border: "1px solid #f4b304" }} />
      <br />
      <br />
      {/* Footer */}

      <Box sx={{ color: "background.paper" }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Ecowiser!
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="background.paper"
          component="p"
        >
          we are a group of passionate individuals who want to mitigate the
          climate crisis by acting as a bridge between ideas and actions.
        </Typography>
        <br />
        <br />
      </Box>
      {/* End footer */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography component="h1" variant="h5">
            {currentId ? "Edit Note" : "Add Note"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
            />
            <TextField
              margin="normal"
              fullWidth
              name="tagline"
              label="tagline"
              id="tagline"
              value={postData.tagline}
              onChange={(e) =>
                setPostData({ ...postData, tagline: e.target.value })
              }
            />

            <TextField
              margin="normal"
              id="about"
              label="Body"
              name="about"
              multiline
              rows={4}
              fullWidth
              value={postData.about}
              onChange={(e) =>
                setPostData({ ...postData, about: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#f4b304" }}
            >
              {currentId ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
