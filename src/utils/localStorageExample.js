
  const bgColor = () => {
    const randomNumber = Math.floor(Math.random() * 359);

    return {
      backgroundColor: `hsl(${randomNumber}deg 30% 55%)`,
    };
  };

  const [rdmClr, setRdmClr] = useState({});

  useEffect(() => {
    localStorage.setItem("rdmClr", JSON.stringify(bgColor()));
    setRdmClr(JSON.parse(localStorage.getItem("rdmClr")));
    return () => {
      localStorage.removeItem("rdmClr");
    };
  }, []);