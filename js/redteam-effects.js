// Red Team Interactive Effects
class RedTeamEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupTypingAnimation();
    }

    // Live Typing Animation for Skills
    setupTypingAnimation() {
        const skills = [
            "Web & API Application Penetration Testing",
            "Network Infrastructure Penetration Testing",
            "Mobile Application Penetration Testing",
            "Cloud Security Assessment",
            "Cloud Configuration Review",
            "Source Code Review",
            "Active Directory Exploitation",
            "Social Engineering Security Assessment",
            "Zero-Day Research",
            "Vulnerability Assessment & Management",
            "Red Team Operations",
            "OSINT & Reconnaissance"
        ];

        let currentSkill = 0;
        let currentChar = 0;
        let isDeleting = false;
        const typingElement = document.getElementById('typing-skills');
        
        if (!typingElement) return;

        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;

        const type = () => {
            const current = skills[currentSkill];
            
            if (isDeleting) {
                typingElement.textContent = current.substring(0, currentChar - 1);
                currentChar--;
            } else {
                typingElement.textContent = current.substring(0, currentChar + 1);
                currentChar++;
            }

            let speed = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && currentChar === current.length) {
                speed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentSkill = (currentSkill + 1) % skills.length;
            }

            setTimeout(type, speed);
        };

        type();
    }

    // Terminal Animation with Red Team Commands
    setupTerminalAnimation() {
        const commands = [
            { cmd: "nmap -sS -O target.com", output: "Starting Nmap scan...\nHost is up (0.023s latency)\n22/tcp open ssh\n80/tcp open http\n443/tcp open https" },
            { cmd: "msfconsole", output: "Metasploit Framework v6.3.25\n[*] Starting the Metasploit Framework console..." },
            { cmd: "use exploit/windows/smb/ms17_010_eternalblue", output: "[*] Using configured payload windows/x64/meterpreter/reverse_tcp" },
            { cmd: "set RHOSTS 192.168.1.0/24", output: "RHOSTS => 192.168.1.0/24" },
            { cmd: "exploit", output: "[*] Started reverse TCP handler\n[+] Target is vulnerable\n[*] Meterpreter session 1 opened" },
            { cmd: "sessions -l", output: "Active sessions:\n  Id  Type  Information\n  --  ----  -----------\n  1   meterpreter  NT AUTHORITY\\SYSTEM" }
        ];

        let currentCommand = 0;
        let currentChar = 0;
        let isTypingCommand = true;
        
        const commandElement = document.getElementById('terminal-command');
        const outputElement = document.getElementById('terminal-output');
        
        if (!commandElement || !outputElement) return;

        const typeCommand = () => {
            const current = commands[currentCommand];
            
            if (isTypingCommand) {
                if (currentChar < current.cmd.length) {
                    commandElement.textContent = current.cmd.substring(0, currentChar + 1);
                    currentChar++;
                    setTimeout(typeCommand, 80);
                } else {
                    // Command typed, show output
                    setTimeout(() => {
                        outputElement.innerHTML += `<div style="color: #00ff88; margin: 5px 0;">${current.output}</div>`;
                        outputElement.scrollTop = outputElement.scrollHeight;
                        
                        // Move to next command
                        setTimeout(() => {
                            currentCommand = (currentCommand + 1) % commands.length;
                            currentChar = 0;
                            commandElement.textContent = '';
                            
                            // Clear output after showing all commands
                            if (currentCommand === 0) {
                                setTimeout(() => {
                                    outputElement.innerHTML = '';
                                }, 3000);
                            }
                            
                            setTimeout(typeCommand, 1000);
                        }, 2000);
                    }, 500);
                }
            }
        };

        typeCommand();
    }

    // Binary Rain Effect
    setupBinaryRain() {
        const canvas = document.getElementById('binary-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const binary = '01';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const drawBinary = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = binary.charAt(Math.floor(Math.random() * binary.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(drawBinary, 50);

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Animated Security Metrics
    setupMetricsAnimation() {
        const metrics = {
            'vuln-count': { start: 1200, end: 1247, suffix: '+' },
            'compromise-rate': { start: 85, end: 89, suffix: '%' },
            'cve-count': { start: 20, end: 23, suffix: '' },
            'exercise-count': { start: 150, end: 156, suffix: '+' }
        };

        Object.keys(metrics).forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;

            const metric = metrics[id];
            let current = metric.start;
            
            const animate = () => {
                if (current < metric.end) {
                    current++;
                    element.textContent = current + metric.suffix;
                    setTimeout(animate, 100);
                } else {
                    // Add random fluctuation
                    setTimeout(() => {
                        const fluctuation = Math.floor(Math.random() * 3) - 1;
                        const newValue = Math.max(metric.start, metric.end + fluctuation);
                        element.textContent = newValue + metric.suffix;
                        
                        // Reset after some time
                        setTimeout(() => {
                            current = metric.start;
                            animate();
                        }, 5000);
                    }, 2000);
                }
            };

            // Start animation with delay
            setTimeout(animate, Math.random() * 2000);
        });
    }

    // Enhanced Glitch Effects for Hackable Elements
    setupHackableElements() {
        const hackableElements = document.querySelectorAll('.hackable-element');
        
        hackableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                // Add corruption effect
                if (element.tagName === 'IMG') {
                    this.corruptImage(element);
                } else {
                    this.corruptText(element);
                }
            });

            element.addEventListener('mouseleave', () => {
                // Remove corruption effect
                setTimeout(() => {
                    element.style.filter = '';
                    if (element.dataset.originalText) {
                        element.textContent = element.dataset.originalText;
                    }
                }, 500);
            });
        });
    }

    corruptImage(img) {
        const filters = [
            'hue-rotate(180deg) contrast(150%)',
            'invert(1) sepia(1) hue-rotate(240deg)',
            'contrast(200%) brightness(150%) saturate(200%)',
            'hue-rotate(90deg) contrast(120%) brightness(120%)'
        ];
        
        let filterIndex = 0;
        const corruptInterval = setInterval(() => {
            img.style.filter = filters[filterIndex % filters.length];
            filterIndex++;
        }, 100);

        setTimeout(() => {
            clearInterval(corruptInterval);
            img.style.filter = '';
        }, 500);
    }

    corruptText(element) {
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }

        const originalText = element.dataset.originalText;
        const corruptChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
        
        let corruptedText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < 0.3 && originalText[i] !== ' ') {
                corruptedText += corruptChars[Math.floor(Math.random() * corruptChars.length)];
            } else {
                corruptedText += originalText[i];
            }
        }
        
        element.textContent = corruptedText;
        
        // Gradually restore text
        setTimeout(() => {
            let restored = '';
            let index = 0;
            const restoreInterval = setInterval(() => {
                if (index < originalText.length) {
                    restored += originalText[index];
                    element.textContent = restored + corruptedText.substring(index + 1);
                    index++;
                } else {
                    clearInterval(restoreInterval);
                    element.textContent = originalText;
                }
            }, 50);
        }, 200);
    }
}

// Initialize Red Team Effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.redTeamEffects = new RedTeamEffects();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RedTeamEffects;
}