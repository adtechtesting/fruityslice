import { useState } from 'react';
import {useNavigate} from "react-router-dom"

export default function LandingPage() {
  const [isHovering, setIsHovering] = useState(false);
  const router=useNavigate()
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 text-white overflow-hidden relative ">

      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white opacity-10 rounded-full"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s infinite linear`
            }}
          />
        ))}
      </div>
   
      <div className="flex flex-col items-center justify-center flex-grow text-center p-4 relative z-10">
        <div className="mb-4 relative">
          <h1 className="text-6xl md:text-7xl font-pixel mb-4 text-yellow-400 drop-shadow-lg relative z-10">
            Fruity Slice
          </h1>
          <div className="absolute -top-6 -right-6 text-5xl animate-bounce">
            🍉
          </div>
          <div className="absolute -bottom-6 -left-6 text-5xl animate-bounce" style={{ animationDelay: '0.5s' }}>
            🍎
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-pixel mb-8 text-yellow-300 drop-shadow-md">
          Slice Fruits & Earn SOL Tokens!
        </h2>
        
  
        <div className="max-w-4xl mb-12 px-4">
          <p className="text-xl mb-6 bg-black bg-opacity-30 p-4 rounded-xl">
            Join the most exciting blockchain game on Solana! Slice fruits, dodge bombs, and earn SOL tokens based on your score.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-3">🍉</div>
              <h3 className="text-lg font-bold mb-2">Slice Fruits</h3>
              <p>Cut as many fruits as possible to rack up points and earn tokens</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-bold mb-2">Earn Tokens</h3>
              <p>Convert your high scores to SOL rewards that you can withdraw</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-bold mb-2">Compete</h3>
              <p>Challenge friends on the global leaderboard for bigger prizes.
             
            <p className='text-blue-100 text-xs'>comming soon</p>
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <button onClick={()=>{
                router("/game")
          }}
            className={`px-12 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl font-pixel text-2xl shadow-xl transform transition-all duration-300 ${isHovering ? 'scale-110 shadow-green-500/50 cursor-pointer' : 'scale-100'}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Let's Play!
          </button>
          

          <div className="absolute -top-12 -right-8 text-4xl animate-ping" style={{ animationDuration: '3s' }}>
            ✨
          </div>
          <div className="absolute -bottom-10 -left-10 text-4xl animate-ping" style={{ animationDuration: '2.5s' }}>
            ✨
          </div>
        </div>
      </div>

 
      <div className="w-full relative mt-12">
        <div className="absolute -top-24 w-full flex justify-evenly">
          {['🍎', '🍓', '🍊', '🍋', '🍉', '🍇', '💣'].map((fruit, index) => (
            <div 
              key={index}
              className="text-5xl animate-bounce shadow-lg" 
              style={{ 
                animationDuration: `${1 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 1}s`,
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
              }}
            >
              {fruit}
            </div>
          ))}
        </div>
        

        <div className="h-32 bg-gradient-to-b from-green-600 to-green-800 relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-green-500 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent to-yellow-900"></div>
        </div>
        <div className="h-16 bg-gradient-to-b from-yellow-700 to-yellow-900"></div>
      </div>


      <div className="w-full p-6 bg-black bg-opacity-60 text-center">
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <span className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            <span className="text-yellow-400 text-xl">⚡</span> Fast Transactions
          </span>
          <span className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            <span className="text-yellow-400 text-xl">🛡️</span> Secure Gameplay
          </span>
          <span className="flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            <span className="text-yellow-400 text-xl">💎</span> Daily Rewards
          </span>
        </div>
        
       
      </div>
      
      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        
        .font-pixel {
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}