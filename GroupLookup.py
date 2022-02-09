from pyattck import Attck

attack = Attck()

techniquesid_list = ['T1221', 'S0161']

'''for actor in attack.enterprise.actors:

     if 'DarkHydrus' in actor.name:

         for technique in actor.techniques:

             # print (technique.id)

              techniquesid_list.append(technique.id)'''

             

print (techniquesid_list)


attackers = {}

temp = []

for technique in attack.enterprise.techniques:

          for actor in technique.actors:

               if technique.id not in attackers.keys():

                    attackers[technique.id] = [actor.name]

               else:

                    temp = attackers[technique.id]

                    temp.append(actor.name)

                    attackers[technique.id] = temp


for technique in attack.enterprise.techniques:

     for subtechnique in technique.subtechniques:

          for actor in subtechnique.actors:

               if subtechnique.id not in attackers.keys():

                    attackers[subtechnique.id] = [actor.name]

               else:

                    temp = attackers[subtechnique.id]

                    temp.append(actor.name)

                    attackers[subtechnique.id] = temp

                    
for malware in attack.enterprise.malwares:

          for actor in malware.actors:

               if malware.id not in attackers.keys():

                    attackers[malware.id] = [actor.name]

               else:

                    temp = attackers[malware.id]

                    temp.append(actor.name)

                    attackers[malware.id] = temp

list2=[]

counter=0

for x in techniquesid_list:

     if (counter == 0):

          list2 = attackers[x]

     else:

          list1= list2

          list2 = attackers[x]

          list2 = list(set(list1).intersection(list2))

     counter+=1

print (list2)



                    









