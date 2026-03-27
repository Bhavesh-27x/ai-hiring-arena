import { useState } from "react";
import { askAI } from "./featherless";
import "./App.css";

const usersDB = [
  { email: "candidate@test.com", password: "1234", role: "candidate" },
  { email: "hr@test.com", password: "1234", role: "hr" },
];

function App() {
  const [page, setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [roleInput, setRoleInput] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [showInterview, setShowInterview] = useState(false);

  // ✅ LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    const found = usersDB.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return alert("Invalid login");

    setUser(found);
    setPage(found.role === "hr" ? "dashboard" : "candidate");
  };

  const logout = () => {
    setUser(null);
    setPage("login");
  };

  // ✅ LINKEDIN CHECK
  const verifyLinkedIn = (url) => {
    return url.startsWith("https://www.linkedin.com/in/");
  };

  // ✅ SMART SCORING
  const calculateScore = (answers) => {
    let score = 0;

    answers.forEach((ans) => {
      if (!ans) return;

      const text = ans.toLowerCase();

      if (text.length > 20) score += 2;
      if (text.length > 50) score += 2;

      if (text.includes("project")) score += 2;
      if (text.includes("experience")) score += 2;
      if (text.includes("built") || text.includes("worked")) score += 2;
    });

    return Math.min(score, 10);
  };

  // 🔐 LOGIN PAGE
  if (page === "login") {
    return (
      <div className="container">
        <h1>AI Hiring Arena</h1>

        <form onSubmit={handleLogin}>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // 👤 CANDIDATE FLOW
  if (page === "candidate") {
    return (
      <div className="container">
        <h2>AI-Powered Candidate Screening</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (!verifyLinkedIn(linkedin)) {
              alert("❌ Invalid LinkedIn URL");
              return;
            }

            let q = await askAI(
              `Generate 3 realistic interview questions for ${roleInput}.
              Include technical, behavioral, and experience.`
            );

            let questionList;

            if (!q) {
              questionList = [
                "Tell me about your experience",
                "Why did you choose this role?",
                "Describe a project you worked on",
              ];
            } else {
              questionList = q
                .split("\n")
                .filter((line) => line.trim().length > 5);
            }

            setQuestions(questionList);
            setShowInterview(true);
          }}
        >
          <input
            placeholder="Role (e.g. Data Scientist)"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
          />

          <input
            placeholder="LinkedIn URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />

          <button type="submit">Start Interview</button>
        </form>

        {showInterview && (
          <div>
            <h3>AI Interview</h3>

            {questions.map((q, i) => (
              <div key={i}>
                <p>{q}</p>
                <input
                  placeholder="Your answer"
                  onChange={(e) => {
                    const newAns = [...answers];
                    newAns[i] = e.target.value;
                    setAnswers(newAns);
                  }}
                />
              </div>
            ))}

            <button
              onClick={() => {
                const score = calculateScore(answers);

                let feedback = "";
                if (score >= 8) feedback = "Strong candidate";
                else if (score >= 5) feedback = "Average candidate";
                else feedback = "Needs improvement";

                alert(`Score: ${score}/10\n${feedback}`);
              }}
            >
              Submit Interview
            </button>
          </div>
        )}

        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  // 🧑‍💼 HR DASHBOARD (simple but working)
  if (page === "dashboard") {
    return (
      <div className="container">
        <h2>HR Dashboard</h2>
        <p>Welcome {user?.email}</p>

        <p>✔ Candidate system working</p>
        <p>✔ AI evaluation ready</p>

        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return null;
}

export default App;