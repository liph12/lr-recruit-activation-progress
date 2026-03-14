import { Box, Typography, Divider, Grid, Chip, Container } from "@mui/material";
import {
  OpenInNewRounded,
  CheckCircleRounded,
  InfoRounded,
  UploadRounded,
} from "@mui/icons-material";
import { useAppProvider } from "../providers/AppProvider";
import { useEffect, useState } from "react";
import type { Course } from "../types/course";
import useExternalAxios from "../hooks/useExternalAxios";
import StyledButton from "../components/utils/StyledButton";
import { Link } from "react-router-dom";
import StyledTextField from "../components/utils/StyledTextField";
import PageLoader from "../components/PageLoader";

interface ExternalUser {
  id: number;
  email: string;
  requiresEndorsement: boolean;
}

export default function TrainingCourses() {
  const axios = useExternalAxios();
  const { user, desktop } = useAppProvider();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [externalUser, setExternalUser] = useState<ExternalUser | null>(null);
  const [endorsement, setEndorsement] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndorsement(e.target.files ? e.target.files[0] : null);

  const handleUploadEndorsement = async () => {
    try {
      setUploading(true);

      const formData = new FormData();

      if (endorsement) {
        formData.append("endorsementLetter", endorsement);
      }

      const response = await axios.post(
        `/integration/agent/${externalUser?.id}/reupload-endorsement`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { member } = response.data;

      setExternalUser((prev) =>
        prev
          ? { ...prev, requiresEndorsement: member?.endorsement === null }
          : prev
      );
    } catch (e) {
      // to do
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const storeAndResolveUserAsync = async () => {
      try {
        const payLoad = {
          emailaddress: user?.email,
          firstname: user?.first_name,
          lastname: user?.last_name,
          photo:
            user?.photo === null
              ? null
              : `https://leuteriorealty.com/memberfiles/${user?.agent_id}/${user?.photo}`,
          invitedBy: user?.sponsor.name,
        };

        const response = await axios.post(
          `/integration/agent/register-or-resolve`,
          payLoad,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        setExternalUser({
          id: data.member.id,
          email: data.member.emailaddress,
          requiresEndorsement: data.requires_endorsement,
        });
      } catch (e) {
        // to do
      } finally {
        // to do
      }
    };

    storeAndResolveUserAsync();
  }, []);

  useEffect(() => {
    const fetchCoursesAsync = async () => {
      try {
        setLoadingCourses(true);
        const response = await axios.get(
          `/integration/agent/current-courses?email=${externalUser?.email}`
        );
        const { data } = response.data;
        const tmp: Course[] = data;
        let certCount = tmp.filter((c) => c.scores.length > 0).length;
        let index = certCount + 1;

        const _courses = tmp.map((c, k) => {
          const updated: Course = {
            ...c,
            status:
              certCount > 0
                ? index === c.id
                  ? "next"
                  : certCount === c.id
                  ? "done"
                  : certCount < c.id
                  ? "pending"
                  : "done"
                : certCount === k
                ? "next"
                : "pending",
          };

          return updated;
        });

        setCourses(_courses);
      } catch (e) {
        // to do
      } finally {
        setLoadingCourses(false);
      }
    };

    if (externalUser) {
      const { requiresEndorsement } = externalUser;

      if (!requiresEndorsement) {
        fetchCoursesAsync();
      }
    }
  }, [externalUser]);

  if (!externalUser) {
    return <PageLoader title="getting data ready" />;
  }

  if (loadingCourses) {
    return <PageLoader title="preparing modules" />;
  }

  return (
    <>
      <Container maxWidth="lg">
        <Typography variant={desktop ? "h4" : "h5"}>
          Get Started with FIRE
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <InfoRounded color="action" fontSize={desktop ? "large" : "medium"} />
          {externalUser?.requiresEndorsement ? (
            <Box>
              <Typography variant={desktop ? "h6" : "body1"}>
                Please upload your endorsement letter.
              </Typography>
              <Typography variant="body2">
                Accepted file types: JPG, PNG, PDF. Maximum file size: 5MB.
              </Typography>
            </Box>
          ) : (
            <Typography variant={desktop ? "h5" : "body1"}>
              Please take and finish modules 1 - 3
            </Typography>
          )}
        </Box>
      </Container>
      <Box component={desktop ? Container : "div"} sx={{ px: desktop ? 0 : 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            height: externalUser?.requiresEndorsement ? "50vh" : "auto",
          }}
        >
          <Box sx={{ mt: 5 }}>
            {externalUser?.requiresEndorsement ? (
              <Grid container spacing={1}>
                <Grid size={{ lg: 6, md: 6, xs: 12 }}>
                  <StyledTextField
                    type="file"
                    name="endorsement"
                    handleChange={handleChangeFile}
                    props={{
                      inputProps: {
                        accept: ".jpg,.jpeg,.png,.pdf",
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ lg: 6, md: 6, xs: 12 }}>
                  <StyledButton
                    variant="contained"
                    fullWidth={!desktop}
                    startIcon={<UploadRounded />}
                    disabled={endorsement === null}
                    loading={uploading}
                    onClick={handleUploadEndorsement}
                  >
                    Upload file
                  </StyledButton>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {courses.map((c, k) => (
                  <Grid key={k} size={{ lg: 4, md: 12, xs: 12 }}>
                    <Box
                      sx={{
                        height: 150,
                        bgcolor: "#fff",
                        px: 2,
                        py: 1,
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #eee",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Typography variant="h3">{k + 1}</Typography>

                        <Box sx={{ width: "100%" }}>
                          <Typography variant={desktop ? "h6" : "body1"}>
                            {c.title}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2">
                            {c.speaker.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          mt: "auto",
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h5">
                          <Typography variant="h4" component="span">
                            {c.scores[0]?.score ?? 0}
                          </Typography>
                          /10
                        </Typography>

                        <Divider orientation="vertical" sx={{ height: 35 }} />

                        <Chip
                          label={c.status}
                          size="small"
                          color={
                            c.status === "done"
                              ? "success"
                              : c.status === "next"
                              ? "primary"
                              : "default"
                          }
                        />
                        <Box
                          component={Link}
                          to={`/welcome/get-started/exam/${c.id}`}
                          sx={{
                            width: "100%",
                            pointerEvents:
                              c.status === "pending" ? "none" : "auto",
                          }}
                        >
                          <StyledButton
                            fullWidth
                            variant="outlined"
                            size="small"
                            disabled={c.status === "pending"}
                            startIcon={
                              c.status === "pending" ? (
                                <InfoRounded />
                              ) : c.status === "done" ? (
                                <CheckCircleRounded />
                              ) : (
                                <OpenInNewRounded />
                              )
                            }
                          >
                            {c.status === "pending"
                              ? "Not available"
                              : c.status === "done"
                              ? "Re-take"
                              : "Take exam"}
                          </StyledButton>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
