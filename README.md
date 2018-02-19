# toy-robot-simulator
toy robot simulator using javascript

## Description
Input Command to control the toy robot.
The commands available are:

- **PLACE X, Y, DIRECTION (PLACE 0,1,NORTH):** Place the robot on the table.
- **MOVE:** Move the robot one unit in the direction it is facing
- **LEFT:** Turn the robot left
- **RIGHT:** Turn the robot right
- **REPORT:** Report the current position and direction of the robot (0,0,NORTH)

The table is a 5x5 grid, and any command that would result in the robot being off the table will be ignored.