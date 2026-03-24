from modelcontextprotocol.server import MCPServer
from modelcontextprotocol.types import MCPRequest, MCPResponse

# Define your handler for MCP requests
def handle_request(request: MCPRequest) -> MCPResponse:
    # Example: echo the request
    return MCPResponse(result={"echo": request.dict()})

if __name__ == "__main__":
    server = MCPServer(handle_request)
    server.run()
