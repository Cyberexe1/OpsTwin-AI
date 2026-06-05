from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class AgentOutput:
    agent_name: str
    confidence: float
    findings: dict
    reasoning: str
    recommendations: list[str] = field(default_factory=list)


class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def investigate(self, context: dict) -> AgentOutput:
        """Execute the agent's investigation logic."""
        pass
