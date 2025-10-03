import { Shield, Zap, Eye, Globe, Users, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const features = [
    {
      icon: Eye,
      title: "Advanced Computer Vision",
      description: "State-of-the-art AI models trained on millions of license plate images from around the world"
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Real-time detection with processing speeds under 2 seconds for most images"
    },
    {
      icon: Shield,
      title: "High Accuracy Rate",
      description: "99.2% accuracy rate across different lighting conditions, angles, and plate formats"
    },
    {
      icon: Globe,
      title: "Global Support",
      description: "Supports license plate formats from 50+ countries and regions worldwide"
    }
  ];

  const stats = [
    { label: "Accuracy Rate", value: "99.2%" },
    { label: "Countries Supported", value: "10+" },
    { label: "Processing Speed", value: "<2s" },
    { label: "API Uptime", value: "99.9%" }
  ];

  const teamMembers = [
    { name: "Deepanshu Yadav", role: "Backend Engineer", specialty: "Cloud Architecture" },
    { name: "Marcus Rodriguez", role: "Backend Engine", specialty: "System Architecture" },
    { name: "Aisha Patel", role: "Frontend Developer", specialty: "User Experience" },
    { name: "James Kim", role: "DevOps Engineer", specialty: "Infrastructure" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              About SafeEntry
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Revolutionizing automatic number plate recognition with cutting-edge AI technology. 
              Our system combines advanced computer vision algorithms with intuitive design to deliver 
              unparalleled accuracy and performance.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="glass p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              To democratize advanced license plate recognition technology, making it accessible, 
              reliable, and efficient for organizations of all sizes. We believe in the power of 
              AI to enhance security, streamline operations, and create safer communities.
            </p>
          </Card>

          {/* Key Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="glass p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Performance Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="glass p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <Card className="glass p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">AI & Machine Learning</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">TensorFlow</Badge>
                  <Badge variant="secondary">OpenCV</Badge>
                  <Badge variant="secondary">PyTorch</Badge>
                  <Badge variant="secondary">YOLO</Badge>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Backend</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">FastAPI</Badge>
                  <Badge variant="secondary">Redis</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Vite</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Team */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="glass p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.specialty}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Awards & Recognition */}
          <Card className="glass p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Award className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-bold">Awards & Recognition</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Best AI Innovation 2024</h3>
                <p className="text-sm text-muted-foreground">Chandigarh Group of Colleges</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Top Computer Vision Solution</h3>
                <p className="text-sm text-muted-foreground">Chandigarh University</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Excellence in Security Tech</h3>
                <p className="text-sm text-muted-foreground">Security Innovation Awards</p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="glass p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <div className="space-y-4">
              <p className="text-lg">
                Have questions or need support? We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="outline" className="text-sm px-4 py-2">
                  yaadav.deepanshu@gmail.com
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  Chandigarh, IN
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;