const Rad=50; 
let Table = new Array(5);
let Num = new Array(5);
let Length = [5,4,5,4,5];
let const_=Rad*Math.sqrt(3)/2;
let FIND=-1,LOCK=false;
let Mode;
const Init=[[90,505],[220,505],[350,505],[480,505],[610,505]];
let Res=[[90,505],[220,505],[350,505],[480,505],[610,505]];
let Block=new Array(5);
let StartTime,NowTime=0,Score=0;
function setup() 
{
  createCanvas(700, 600);
  frameRate(60);
  //Set_table();
  Intro();
}

function draw()
{
  NowTime+=1;
  TimePassed=ceil((NowTime-StartTime)/60);
  if (Mode==="playing")
  {
    if (TimePassed == 120)
      End_game();
    else
      Draw();
  }
}

function Draw()
{
  background(225);
  push();
  textSize(40);
  textAlign(CENTER,TOP);
  //time
  text("Time",650,20);
  text(TimePassed+"s",650,80);
  //score
  text("Score",50,20);
  text(Score,50,80);
  //"gioi thieu" button
  fill("black");
  rect(72,550,200,50);
  textAlign(CENTER,CENTER);
  fill("white");
  textSize(35);
  text("Luật chơi",0,575,350);
  pop();
  //table and answer
  for (let i=0; i<5; ++i)
  for (let j=0; j<Length[i]; ++j)
      Hexagon(Table[i][j][0],Table[i][j][1],Num[i][j]);
  for (let i=0; i<5; ++i)
    Hexagon(Res[i][0],Res[i][1],Block[i]);
  if (FIND>=0)
    Hexagon(Res[FIND][0],Res[FIND][1],Block[FIND]);
}

function Intro()
{
  Mode="intro";
  background("#1EF5EF");
  push();
  //Title
  textSize(45);
  textAlign(CENTER, TOP);
  text("Tổ hợp hình lục giác",0,40,700);
  //Introduction
  textSize(25);
  textAlign(LEFT, TOP);
  text("Hai cậu cháu trai Jorge và Diego vô cùng thích thú với câu đố ô số lục giác của ông chú Emmanual nên đã dựa vào đó sáng tạo một trò chơi mới. Cho một bảng gồm 23 lục giác rỗng. Với mỗi nước đi, bạn sẽ thay thế một lục giác rỗng với một trong năm lục giác cho trước. Nhiệm vụ của bạn là trong mỗi nước đi, phải làm biến mất số nhiều nhất lục giác, biết hai lục giác bất kì sẽ biến mất nếu chúng có hai hình tam giác chung cạnh in đậm chứa cùng một số. Với mỗi nước đi, số điểm của bạn sẽ được cộng với bình phương số lục giác biến mất. Hãy xem trong 120s, bạn có thể làm biến mất bao nhiêu hình lục giác nhé!",20,150,660);
  //The start button
  fill("black");
  rect(250,550,200,50);
  textAlign(CENTER,CENTER);
  fill("white");
  textSize(35);
  text("Bắt đầu",0,575,700);
  pop();
}

function End_game()
{
  Mode="intro";
  background("#1EF5EF");
  push();
  //Title
  textSize(45);
  textAlign(CENTER, TOP);
  text("Kết thúc trò chơi!",0,40,700);
  //Score
  text("Bạn đã được:",20,150,660);
  text(Score,0,250,700);
  //The restart button
  fill("black");
  rect(250,550,200,50);
  textAlign(CENTER,CENTER);
  fill("white");
  textSize(35);
  text("Chơi lại",0,575,700);
  pop();
}

function Set_table()
{
  StartTime=NowTime;
  Mode="playing";
  Score=0;
  for (let i=0,x=width/2-3*Rad; i<5; ++i, x+=1.5*Rad)
  {
    Table[i] = new Array(Length[i]);
    Num[i] = new Array(Length[i]);
    for (let j=0,y=10+((i&1)+1)*const_; j<Length[i]; ++j, y+=2*const_)
    {
      Table[i][j]=[x,y];
      Num[i][j]="------";
    }
    Block[i]="";
    for (let k=0; k<6; ++k)
      Block[i]+=str(round(random(0.5,6.5))); //1->6
  }
  Ran_dom(4);
}

function mouseDragged()
{
  if (Mode === "intro") return;
  if (LOCK===false)
  {
    FIND=hexa_clicked();
    if (FIND===-1) return;
    LOCK=true;
  }
  Res[FIND][0]+=mouseX-pmouseX; 
  Res[FIND][1]+=mouseY-pmouseY;
}

function hexa_clicked()
{
    for (let i=0; i<5; ++i)
      if (inside(Res[i][0],Res[i][1],pmouseX,pmouseY))
            return i;
  return -1;
}

function mouseReleased()
{
  // if bat dau or choi lai button
  if (Mode === "intro") 
  {
    if (mouseX>=250 && mouseX<=450 && mouseY>=550 && mouseY<=600)  
    Set_table();
    return;
  }
  // if intro button
  if (mouseX>=72 && mouseX<=272 && mouseY>=550)
  {
    Intro();
    return;
  }
  LOCK=false;
  if (FIND===-1 || Mode !== "playing") return;
  let coor=hexa_release();
  Res[FIND][0]=Init[FIND][0];
  Res[FIND][1]=Init[FIND][1];
  if (coor === -1) return;
  Num[coor[0]][coor[1]]=Block[FIND];
  Ran_dom(FIND);
  check_and_delete();
}

function hexa_release()
{
  for (let i=0; i<5; ++i)
  for (let j=0; j<Length[i]; ++j)
    if  ((Res[FIND][0]-Table[i][j][0])*(Res[FIND][0]-Table[i][j][0])+(Res[FIND][1]-Table[i][j][1])*(Res[FIND][1]-Table[i][j][1])<=400 && Num[i][j]==="------")
      return [i,j];
  return -1;
}

let coor_side=[[0,-1],[+1,0],[+1,+1],[0,+1],[-1,+1],[-1,0]];
let side_=[3,4,5,0,1,2];

function check_and_delete()
{ 
  let BOOL=new Array(5), ScoreCount=0, Count=0;
  for (let i=0; i<5; ++i)
  {
    BOOL[i]=new Array(5);
    for (let j=0; j<5; ++j)
      BOOL[i][j]=false;
  }
  
  let px,py;
  for (let x=1; x<=3; x+=2)
  for (let y=0; y<=3; ++y)
  for (let k=1; k<=5; ++k)
  {
    if (y===3 && k===3) continue;
    px=x+coor_side[k][0];
    py=y+coor_side[k][1];
    if (Num[x][y][k] != "-" && Num[x][y][k] === Num[px][py][side_[k]])
    {
      BOOL[x][y]=true;
      BOOL[px][py]=true;
    }
  }
  for (let x=0; x<6; x+=2)
  for (let y=0; y<=3; ++y)
    if (Num[x][y][3] === Num[x][y+1][0]) 
    {
      BOOL[x][y]=true;
      BOOL[x][y+1]=true;
    }
  for (let i=0; i<5; ++i)
  for (let j=0; j<Length[i]; ++j)
    if (BOOL[i][j] && Num[i][j]!=="------")
    {
        Num[i][j]="------";
        ++ScoreCount;
    }
    else 
      Count += (Num[i][j]==="------");
  Score+=ScoreCount*ScoreCount;
  if (Count == 0) End_game();
}

function Ran_dom(id)
{
  Block[id]="";
  let index;
  do
    index=round(random(-0.5,4.5)); //0->5
  while (index==id);
  
  let thesame=round(random(-0.5,4.5));
  
  for (let i=0; i<6; ++i)
  {
    if (i === thesame)
      Block[id]+=Block[index][side_[thesame]];
    else 
      Block[id]+=round(random(0.5,6.5));
  }
  //console.log(id,index,thesame);
}

function inside(pointx,pointy,x,y)
{
  let Y=pointy-y, X=pointx-x;
  let l2 = Y * Y + X * X;
  if (l2 > Rad*Rad) return false;
  if (l2 < Rad*0.75) return true;
  let pY = Y * 2 / Math.sqrt(3); // 2/sqrt(3)
  if (pY > Rad || pY < -Rad) return false;
  let pX = 0.5 * pY + X;
  if (pX > Rad || pX < -Rad) return false;
  if (pY - pX > Rad || pY - pX < -Rad) return false;
  return true;
}

let Numxy=[[0,      -Rad/Math.sqrt(3)],
           [Rad/2,  -Rad*Math.sqrt(3)/6],
           [Rad/2,   Rad*Math.sqrt(3)/6],
           [0,       Rad/Math.sqrt(3)],
           [-Rad/2,  Rad*Math.sqrt(3)/6],
           [-Rad/2, -Rad*Math.sqrt(3)/6]];

function Hexagon(x,y,str)
{
  push();
  translate(x,y);
  //draw the hexagon
  strokeWeight(3);
  if (str!=="------") 
    fill("#89D8F1");
  else 
    fill("white");
  beginShape();
  vertex(-Rad/2, -const_);
  vertex(Rad/2, -const_);
  vertex(Rad, 0);
  vertex(Rad/2, const_);
  vertex(-Rad/2, const_);
  vertex(-Rad,0);
  endShape(CLOSE);
  
  if (str!=="------")
  {
    strokeWeight(1);
    line(-Rad/2, -const_, Rad/2, const_);
    line(Rad/2, -const_, -Rad/2, const_);
    line(Rad, 0, -Rad, 0);
    fill("black");
    textAlign(CENTER,CENTER);
    textSize(20);
    for (let i=0; i<6; ++i)
      text(str[i],Numxy[i][0],Numxy[i][1]);
  }
  pop();
}
