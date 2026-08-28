import {
  Link,
} from "react-router-dom";
import ishratImage from "../assets/ishrat.png";
import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="min-h-screen bg-yellow-300 text-slate-950">

      <Navbar />

      <main className="mx-auto max-w-7xl px-5 sm:px-6 md:px-12 pt-28 pb-16">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="text-center">

          <p className="font-mono font-black tracking-[0.22em]">
            ABOUT GAMEGRID
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mt-3 leading-tight">
            PLAY. THINK.
            <br />
            LEVEL UP. 🎮
          </h1>

          <p className="max-w-3xl mx-auto mt-5 text-lg sm:text-xl font-semibold text-slate-700">
            GameGrid is a full-stack brain-training
            platform built to make learning,
            problem-solving, and skill improvement
            more interactive and fun.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <a
              href="/#games"
              className="bg-slate-950 text-white border-2 border-slate-950 rounded-xl px-6 py-3 font-black shadow-[5px_5px_0_#ec4899] hover:-translate-y-1 transition"
            >
              🎮 EXPLORE GAMES
            </a>

            <Link
              to="/leaderboard"
              className="bg-white border-2 border-slate-950 rounded-xl px-6 py-3 font-black shadow-[5px_5px_0_#111827] hover:-translate-y-1 transition"
            >
              🏆 LEADERBOARD
            </Link>

          </div>

        </section>

        {/* =================================================
            WHY GAMEGRID
        ================================================= */}

        <section className="mt-16">

          <div className="text-center mb-8">

            <p className="font-mono font-black tracking-widest text-sm">
              WHY GAMEGRID?
            </p>

            <h2 className="text-3xl sm:text-4xl font-black mt-2">
              More Than Just Mini Games 🧠
            </h2>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <FeatureCard
              icon="🧠"
              title="Brain Training"
              text="Challenge memory, logic, calculation, and pattern recognition through interactive games."
              bg="bg-cyan-200"
            />

            <FeatureCard
              icon="🎮"
              title="Interactive Games"
              text="Play different games with multiple difficulty levels and engaging gameplay."
              bg="bg-pink-200"
            />

            <FeatureCard
              icon="🏆"
              title="Progress & Competition"
              text="Track XP, levels, achievements, game history, streaks, and leaderboard rankings."
              bg="bg-orange-200"
            />

            <FeatureCard
              icon="🔥"
              title="Daily Challenges"
              text="Complete daily missions, earn bonus XP, and build consistent playing streaks."
              bg="bg-violet-200"
            />

          </div>

        </section>

        {/* =================================================
            DEVELOPER
        ================================================= */}

        <section className="mt-16">

          <div className="bg-white border-2 border-slate-950 rounded-3xl overflow-hidden shadow-[8px_8px_0_#111827]">

            <div className="grid lg:grid-cols-[320px_1fr]">

              {/* LEFT */}

              <div className="bg-pink-500 border-b-2 lg:border-b-0 lg:border-r-2 border-slate-950 p-8 flex flex-col items-center justify-center text-center">

                <div className="w-40 h-40 rounded-full border-4 border-slate-950 overflow-hidden shadow-[6px_6px_0_#111827] bg-white">
  <img
    src={ishratImage}
    alt="Ishrat Jahan"
    className="w-full h-full object-cover"
  />
</div>

                <p className="font-mono font-black tracking-widest mt-6">
                  THE DEVELOPER
                </p>

                <h2 className="text-3xl font-black mt-2">
                  Ishrat Jahan
                </h2>

                <p className="font-bold mt-2">
                  Computer Science Engineering
                </p>

              </div>

              {/* RIGHT */}

              <div className="p-7 sm:p-10">

                <p className="font-mono font-black tracking-widest text-sm">
                  HEY THERE 👋
                </p>

                <h2 className="text-3xl sm:text-5xl font-black mt-2">
                  I’m Ishrat,
                  <br />
                  the creator of GameGrid.
                </h2>

                <p className="text-lg font-semibold text-slate-700 mt-5 leading-relaxed">
                  I enjoy building full-stack
                  applications, solving programming
                  problems, and turning ideas into
                  interactive digital experiences.
                </p>

                <p className="text-lg font-semibold text-slate-700 mt-4 leading-relaxed">
                  GameGrid is one of my projects where
                  I combined frontend development,
                  backend development, authentication,
                  database management, game logic,
                  and progress tracking into a single
                  platform.
                </p>

                {/* SKILLS */}

                <div className="flex flex-wrap gap-3 mt-7">

                  <SkillTag text="☕ Java" />
                  <SkillTag text="🧩 DSA" />
                  <SkillTag text="⚛️ React" />
                  <SkillTag text="🟢 Node.js" />
                  <SkillTag text="🚀 Express" />
                  <SkillTag text="🍃 MongoDB" />
                  <SkillTag text="🎨 Tailwind CSS" />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            PROJECT PURPOSE
        ================================================= */}

        <section className="mt-16">

          <div className="grid lg:grid-cols-2 gap-8">

            <div className="bg-cyan-200 border-2 border-slate-950 rounded-3xl p-7 sm:p-9 shadow-[6px_6px_0_#111827]">

              <p className="font-mono font-black tracking-widest text-sm">
                THE IDEA
              </p>

              <h2 className="text-3xl font-black mt-2">
                Why I Built GameGrid 💡
              </h2>

              <p className="font-semibold text-slate-700 mt-4 leading-relaxed">
                I wanted to build something that was
                more than a simple frontend game.
                The goal was to create a platform
                where users could play, improve,
                track their progress, and feel
                rewarded for returning.
              </p>

              <p className="font-semibold text-slate-700 mt-4 leading-relaxed">
                That idea grew into GameGrid — a
                complete gaming platform with user
                accounts, statistics, XP, levels,
                achievements, leaderboards, and
                daily challenges.
              </p>

            </div>

            <div className="bg-slate-950 text-white border-2 border-slate-950 rounded-3xl p-7 sm:p-9 shadow-[6px_6px_0_#ec4899]">

              <p className="font-mono font-black tracking-widest text-cyan-300 text-sm">
                WHAT I LEARNED
              </p>

              <h2 className="text-3xl font-black mt-2">
                Built To Learn 🚀
              </h2>

              <div className="space-y-4 mt-6">

                <LearnItem
                  icon="⚛️"
                  text="Reusable React components and application routing"
                />

                <LearnItem
                  icon="🔐"
                  text="JWT authentication and protected routes"
                />

                <LearnItem
                  icon="🟢"
                  text="REST APIs using Node.js and Express"
                />

                <LearnItem
                  icon="🍃"
                  text="MongoDB models, persistence, and user data"
                />

                <LearnItem
                  icon="🎮"
                  text="Game logic, scoring systems, and difficulty levels"
                />

                <LearnItem
                  icon="📊"
                  text="XP, achievements, leaderboards, and player progress"
                />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            TECH STACK
        ================================================= */}

        <section className="mt-16">

          <div className="text-center">

            <p className="font-mono font-black tracking-widest text-sm">
              BUILT WITH
            </p>

            <h2 className="text-3xl sm:text-4xl font-black mt-2">
              The GameGrid Stack ⚡
            </h2>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">

            <TechCard
              icon="⚛️"
              name="React"
            />

            <TechCard
              icon="🎨"
              name="Tailwind"
            />

            <TechCard
              icon="🟢"
              name="Node.js"
            />

            <TechCard
              icon="🚀"
              name="Express"
            />

            <TechCard
              icon="🍃"
              name="MongoDB"
            />

            <TechCard
              icon="🔐"
              name="JWT"
            />

          </div>

        </section>

        {/* =================================================
            END CTA
        ================================================= */}

        <section className="mt-16">

          <div className="bg-pink-500 border-2 border-slate-950 rounded-3xl p-8 sm:p-12 text-center shadow-[8px_8px_0_#111827]">

            <p className="font-mono font-black tracking-widest">
              READY TO PLAY?
            </p>

            <h2 className="text-4xl sm:text-5xl font-black mt-3">
              Test Your Brain. 🧠
            </h2>

            <p className="font-semibold text-lg mt-3">
              Pick a challenge, earn XP,
              climb the leaderboard, and
              keep improving.
            </p>

            <a
              href="/#games"
              className="inline-block mt-7 bg-yellow-300 border-2 border-slate-950 rounded-xl px-7 py-3 font-black shadow-[5px_5px_0_#111827] hover:-translate-y-1 transition"
            >
              🎮 START PLAYING →
            </a>

          </div>

        </section>

        {/* =================================================
            FOOTER TEXT
        ================================================= */}

        <div className="text-center mt-14">

          <p className="font-black text-xl">
            🎮 GAMEGRID
          </p>

          <p className="font-mono font-bold tracking-widest text-sm mt-2">
            PLAY • THINK • IMPROVE
          </p>

          <p className="text-sm font-semibold text-slate-600 mt-3">
            Designed & built by Ishrat Jahan
          </p>

        </div>

      </main>

    </div>
  );
}

// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({
  icon,
  title,
  text,
  bg,
}) {
  return (
    <div
      className={`${bg} border-2 border-slate-950 rounded-2xl p-6 shadow-[5px_5px_0_#111827] hover:-translate-y-1 transition`}
    >

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="text-xl font-black mt-4">
        {title}
      </h3>

      <p className="font-semibold text-slate-700 mt-2">
        {text}
      </p>

    </div>
  );
}

// =====================================================
// SKILL TAG
// =====================================================

function SkillTag({
  text,
}) {
  return (
    <span className="bg-yellow-200 border-2 border-slate-950 rounded-full px-4 py-2 text-sm font-black">
      {text}
    </span>
  );
}

// =====================================================
// LEARN ITEM
// =====================================================

function LearnItem({
  icon,
  text,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-10 h-10 shrink-0 bg-yellow-300 text-slate-950 border-2 border-white rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <p className="font-semibold pt-1.5">
        {text}
      </p>

    </div>
  );
}

// =====================================================
// TECH CARD
// =====================================================

function TechCard({
  icon,
  name,
}) {
  return (
    <div className="bg-white border-2 border-slate-950 rounded-2xl p-5 text-center shadow-[4px_4px_0_#111827] hover:-translate-y-1 transition">

      <div className="text-4xl">
        {icon}
      </div>

      <p className="font-black mt-3">
        {name}
      </p>

    </div>
  );
}

export default About;